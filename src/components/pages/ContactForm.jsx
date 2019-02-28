import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { withFormik } from 'formik';
import { withTranslation, Trans } from 'react-i18next';
import AsyncSelect from 'react-select/lib/Async';
import Textarea from 'react-textarea-autosize';
import debounce from 'debounce-promise';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import withContext from 'src/withContext';
import setValues from 'utils/setValues';
import { SELECT_STYLES, TWITTER_EMPTY_ROW, LINKEDIN_EMPTY_ROW, DEBOUNCE_WAIT } from 'lib/constants';
import { successToast, errorToast } from 'utils/toasts';
import cleanRelatedFields from 'utils/cleanRelatedFields';
import RadioButtons from 'components/RadioButtons';
import BlockUI from 'components/Utils/BlockUI';
import Form from 'components/Form';
import FormSection from 'components/Form/FormSection';
import FormFooter from 'components/Form/FormFooter';
import { NoAccountsMessage } from 'components/Form/NoOptionsMessages';
import LoadingIndicator from 'components/Utils/LoadingIndicator';
import EmailAddressField from 'components/Fields/EmailAddressField';
import PhoneNumberField from 'components/Fields/PhoneNumberField';
import AddressField from 'components/Fields/AddressField';
import SocialMediaField from 'components/Fields/SocialMediaField';
import TagField from 'components/Fields/TagField';
import Suggestions from 'components/Fields/Suggestions';
import LilyTooltip from 'components/LilyTooltip';
import Address from 'components/Utils/Address';
import Account from 'models/Account';
import Contact from 'models/Contact';
import camelToHuman from 'src/utils/camelToHuman';

class InnerContactForm extends Component {
  constructor(props) {
    super(props);

    this.mounted = false;

    this.state = {
      accountSuggestions: { name: [], emailAddress: [], phoneNumber: [] },
      contactSuggestions: { name: [], emailAddress: [], phoneNumber: [] },
      showSuggestions: { name: true, emailAddress: true, phoneNumber: true },
      loading: true
    };
  }

  async componentDidMount() {
    this.mounted = true;

    const { id } = this.props.data;

    let title;

    if (id) {
      await this.loadContact(id);

      title = `${this.props.values.fullName} - Lily`;
    } else {
      title = 'Add contact - Lily';
    }

    if (!this.props.sidebar) {
      document.title = title;
    }

    const { data } = this.props;

    if (data) {
      if (data.contact) {
        Object.keys(data.contact).forEach(key => {
          this.props.setFieldValue(key, data.contact[key]);
        });
      }

      if (data.account) {
        this.props.setFieldValue('accounts', [data.account]);
      }
    }

    if (this.mounted) {
      this.setState({ loading: false });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  loadContact = async (id, existingValues = null) => {
    const contact = await Contact.get(id);

    if (existingValues) {
      if (existingValues.description) {
        const description = `${existingValues.description}\n\n${contact.description}`;
        contact.description = description;
      }

      const { accounts, emailAddresses, phoneNumbers, addresses, tags } = contact;

      contact.accounts = this.concatUnique(existingValues.accounts, accounts, ['id']);
      contact.emailAddresses = this.concatUnique(existingValues.emailAddresses, emailAddresses, [
        'emailAddress'
      ]);
      contact.phoneNumbers = this.concatUnique(existingValues.phoneNumbers, phoneNumbers, [
        'number'
      ]);
      contact.addresses = this.concatUnique(existingValues.addresses, addresses, [
        'address',
        'postalCode'
      ]);
      contact.tags = this.concatUnique(existingValues.tags, tags, ['name']);

      const twitterProfile = contact.socialMedia.find(profile => profile.name === 'twitter');
      const existingTwitterProfile = existingValues.socialMedia.find(
        profile => profile.name === 'twitter'
      );

      if (!twitterProfile && existingTwitterProfile) {
        contact.socialMedia.push(existingTwitterProfile);
      }

      const linkedinProfile = contact.socialMedia.find(profile => profile.type === 'linkedin');
      const existingLinkedinProfile = existingValues.socialMedia.find(
        profile => profile.type === 'linkedin'
      );

      if (!linkedinProfile && existingLinkedinProfile) {
        contact.socialMedia.push(existingLinkedinProfile);
      }
    }

    if (this.mounted) {
      setValues(contact, this.props.setFieldValue);
    }
  };

  concatUnique = (existingValues, newValues, fields) => {
    const uniqueValues = newValues;

    existingValues.forEach(existingValue => {
      // Iterate over all given fields and check if an object with those values already exists.
      const exists = fields.every(field =>
        newValues.some(newValue => newValue[field] === existingValue[field])
      );

      if (!exists) uniqueValues.push(existingValue);
    });

    return uniqueValues;
  };

  searchName = async () => {
    const { contactSuggestions, showSuggestions } = this.state;
    const { firstName, lastName } = this.props.values;

    if (!this.props.values.id && firstName && lastName) {
      const query = `${firstName} ${lastName}`;

      const response = await Contact.query({ search: query, ordering: 'firstName' });

      if (response.results.length > 0) {
        contactSuggestions.name = response.results;
      }

      showSuggestions.name = true;

      this.setState({ contactSuggestions, showSuggestions });
    }
  };

  searchEmailAddress = async emailAddress => {
    const { accountSuggestions, contactSuggestions, showSuggestions } = this.state;

    if (!this.props.values.id && emailAddress) {
      // There was a call for the current user,
      // so try to find an account with the given email address.
      const accountResponse = await Account.query({ search: emailAddress });

      if (accountResponse.results.length > 0) {
        const account = accountResponse.results[0];
        const exists = accountSuggestions.emailAddress.some(
          suggestion => suggestion.account.id === account.id
        );

        const alreadyAdded = this.props.values.accounts.some(
          contactAccount => contactAccount.id === account.id
        );

        if (!exists && !alreadyAdded) {
          accountSuggestions.emailAddress.push({ emailAddress, account });
        }

        showSuggestions.emailAddress = true;
      } else {
        const contactResponse = await Contact.query({ search: emailAddress });

        if (contactResponse.results.length > 0) {
          const contact = contactResponse.results[0];
          const exists = contactSuggestions.emailAddress.some(
            suggestion => suggestion.contact.id === contact.id
          );

          if (!exists) {
            contactSuggestions.emailAddress.push({ emailAddress, contact });
          }

          showSuggestions.emailAddress = true;
        }
      }
    }

    this.setState({ accountSuggestions, contactSuggestions, showSuggestions });
  };

  searchPhoneNumber = async phoneNumber => {
    const { accountSuggestions, contactSuggestions, showSuggestions } = this.state;

    if (!this.props.values.id && phoneNumber) {
      // There was a call for the current user,
      // so try to find an account or contact with the given number.
      const accountResponse = await Account.query({ search: phoneNumber });

      if (accountResponse.results.length > 0) {
        const account = accountResponse.results[0];
        const exists = accountSuggestions.phoneNumber.some(
          suggestion => suggestion.account.id === account.id
        );

        const alreadyAdded = this.props.values.emailAddresses.some(
          contactAccount => contactAccount.id === account.id
        );

        if (!exists && !alreadyAdded) {
          accountSuggestions.phoneNumber.push({ phoneNumber, account });
        }

        showSuggestions.phoneNumber = true;
      } else {
        const contactResponse = await Contact.query({ search: phoneNumber });

        if (contactResponse.results.length > 0) {
          const contact = contactResponse.results[0];
          const exists = contactSuggestions.emailAddress.some(
            suggestion => suggestion.contact.id === contact.id
          );

          if (!exists) {
            contactSuggestions.emailAddress.push({ phoneNumber, contact });
          }

          showSuggestions.phoneNumber = true;
        }
      }

      this.setState({ accountSuggestions, contactSuggestions, showSuggestions });
    }
  };

  searchAccounts = async (query = '') => {
    const request = await Account.query({ search: query, ordering: 'name' });

    return request.results;
  };

  handleAccounts = selected => {
    this.props.setFieldValue('accounts', selected);
  };

  addAccountCallback = account => {
    this.props.setFieldValue('accounts', [...this.props.values.accounts, account]);
  };

  handleRelated = (type, items) => {
    this.props.setFieldValue(type, items);
  };

  handleSocialMedia = event => {
    // Get the ID of the input and change the value based on that ID.
    const socialMediaProfile = this.props.values.socialMedia.find(
      profile => profile.name === event.target.id
    );

    socialMediaProfile.username = event.target.value;

    this.props.setFieldValue('socialMedia', [...this.props.values.socialMedia, socialMediaProfile]);
  };

  handleSalutation = value => {
    this.props.setFieldValue('salutation', value);
  };

  handleGender = value => {
    this.props.setFieldValue('gender', value);
  };

  handleClose = field => {
    const { showSuggestions } = this.state;
    showSuggestions[field] = false;

    this.setState({ showSuggestions });
  };

  renderContactSuggestion = type => {
    const { accountSuggestions, showSuggestions } = this.state;
    const { t } = this.props;

    return accountSuggestions[type].length > 0 && showSuggestions[type] ? (
      <div className="form-suggestions">
        <div className="form-suggestion-title">
          <div>{t('forms:contact.relatedExists', { type: camelToHuman(type) })}</div>

          <button className="hl-interface-btn close-btn" onClick={this.close} type="button">
            <FontAwesomeIcon icon={['far', 'times']} size="lg" />
          </button>
        </div>

        <div className="form-suggestion-items">
          {accountSuggestions[type].map(suggestion => {
            const { account } = suggestion;

            return (
              <div className="form-suggestion-container" key={`account-${type}-${account.id}`}>
                <div className="form-suggestion-row">
                  <div className="form-suggestion-info">
                    <Trans
                      defaults={t('forms:contact.accountAddText', { name: account.name })}
                      components={[<Link to={`/accounts/${account.id}`}>text</Link>]}
                    />
                  </div>

                  <div className="form-suggestion-action">
                    <button
                      className="hl-primary-btn-blue"
                      onClick={() => this.addAccount(account)}
                      type="button"
                    >
                      Add to Works at
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ) : null;
  };

  addAccount = account => {
    const { accountSuggestions } = this.state;
    const { values, setFieldValue } = this.props;

    setFieldValue('accounts', [...values.accounts, account]);

    // Clear the suggestions.
    Object.keys(accountSuggestions).forEach(key => {
      accountSuggestions[key] = {};
    });

    this.setState({ accountSuggestions });
  };

  merge = async contactId => {
    const { contactSuggestions } = this.state;
    const response = await Contact.get(contactId);

    await this.loadContact(response.id, this.props.values);

    this.props.history.push(`/contacts/${response.id}/edit`);

    // Clear the suggestions.
    Object.keys(contactSuggestions).forEach(key => {
      contactSuggestions[key] = {};
    });

    this.setState({ contactSuggestions });
  };

  render() {
    const { contactSuggestions, showSuggestions, loading } = this.state;
    const { values, errors, isSubmitting, handleChange, handleSubmit, currentUser, t } = this.props;

    const hasAccountPhoneNumbers =
      values.accounts.length > 0 && values.accounts[0].phoneNumbers.length > 0;

    return (
      <React.Fragment>
        {!loading ? (
          <BlockUI blocking={isSubmitting}>
            <div className="content-block-container">
              <div className="content-block">
                <div className="content-block-header">
                  <div className="content-block-name">
                    {values.id ? (
                      <React.Fragment>Edit contact</React.Fragment>
                    ) : (
                      <React.Fragment>Add contact</React.Fragment>
                    )}
                  </div>
                </div>

                <div className="content-block-content">
                  <Form handleSubmit={handleSubmit}>
                    <FormSection header="Who was it?">
                      <div className="form-field">
                        <label required>Salutation</label>
                        <RadioButtons
                          options={['Formal', 'Informal']}
                          setSelection={this.handleSalutation}
                        />
                      </div>

                      <div className="form-field">
                        <label required>Gender</label>
                        <RadioButtons
                          options={['Male', 'Female', 'Unknown/Other']}
                          setSelection={this.handleGender}
                        />
                      </div>

                      <div
                        className={`form-field${
                          errors.firstName || errors.lastName ? ' has-error' : ''
                        }`}
                      >
                        <label htmlFor="name" required>
                          Name
                        </label>

                        <div className="display-flex">
                          <div className="flex-grow m-r-10">
                            <input
                              id="firstName"
                              type="text"
                              className="hl-input"
                              placeholder="First name"
                              value={values.firstName}
                              onChange={handleChange}
                              onBlur={this.searchName}
                            />

                            {errors.firstName && (
                              <div className="error-message">{errors.firstName}</div>
                            )}
                          </div>

                          <div className="flex-grow">
                            <input
                              id="lastName"
                              type="text"
                              className="hl-input"
                              placeholder="Last name"
                              value={values.lastName}
                              onChange={handleChange}
                              onBlur={this.searchName}
                            />

                            {errors.lastName && (
                              <div className="error-message">{errors.lastName}</div>
                            )}
                          </div>
                        </div>
                      </div>

                      <Suggestions
                        field="name"
                        type="contact"
                        object={values}
                        suggestions={contactSuggestions.name}
                        display={showSuggestions.name}
                        handleMerge={this.merge}
                        handleClose={this.handleClose}
                      />

                      <div className="form-field">
                        <label htmlFor="accounts">Works at</label>
                        <AsyncSelect
                          defaultOptions
                          isMulti
                          name="accounts"
                          classNamePrefix="editable-input"
                          placeholder="Select one or more account(s)"
                          value={values.accounts}
                          styles={SELECT_STYLES}
                          onChange={this.handleAccounts}
                          loadOptions={debounce(this.searchAccounts, DEBOUNCE_WAIT)}
                          getOptionLabel={option => option.name}
                          getOptionValue={option => option.id}
                          components={{ NoOptionsMessage: NoAccountsMessage }}
                          callback={this.addAccountCallback}
                          currentUser={currentUser}
                        />
                      </div>

                      <div className="form-field">
                        <label htmlFor="description">Description</label>
                        <Textarea
                          id="description"
                          placeholder="Description"
                          minRows={3}
                          maxRows={20}
                          value={values.description}
                          onChange={handleChange}
                        />
                      </div>
                    </FormSection>

                    <FormSection header="Contact information">
                      <div className="form-field">
                        <label>Email address</label>

                        {values.accounts.length > 0 &&
                          values.accounts[0].emailAddresses.length > 0 && (
                            <table className="form-info-table m-b-10">
                              <tbody>
                                {values.accounts[0].emailAddresses.map((emailAddress, index) => (
                                  <tr key={`account-email-${emailAddress.id}`}>
                                    <td>
                                      {index === 0 && (
                                        <React.Fragment>
                                          <FontAwesomeIcon
                                            icon={['far', 'building']}
                                            data-tip={t('forms:contact.accountInfoTooltip')}
                                          />

                                          <LilyTooltip />
                                        </React.Fragment>
                                      )}
                                    </td>
                                    <td>
                                      {emailAddress.emailAddress} ({emailAddress.statusName})
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}

                        <EmailAddressField
                          items={values.emailAddresses}
                          handleRelated={this.handleRelated}
                          onInputBlur={this.searchEmailAddress}
                          errors={errors.emailAddresses}
                        />
                      </div>

                      {this.renderContactSuggestion('emailAddress')}

                      <Suggestions
                        field="emailAddress"
                        type="contact"
                        object={values}
                        suggestions={contactSuggestions.emailAddress}
                        display={showSuggestions.emailAddress}
                        handleClose={this.handleClose}
                      />

                      <div className="form-field">
                        <label>Phone number</label>

                        {hasAccountPhoneNumbers && (
                          <table className="form-info-table m-b-10">
                            <tbody>
                              {values.accounts[0].phoneNumbers.map((phoneNumber, index) => (
                                <tr key={`account-phone-${phoneNumber.id}`}>
                                  <td>
                                    {index === 0 && (
                                      <React.Fragment>
                                        <FontAwesomeIcon
                                          icon={['far', 'building']}
                                          data-tip={t('forms:contact.accountInfoTooltip')}
                                        />

                                        <LilyTooltip />
                                      </React.Fragment>
                                    )}
                                  </td>
                                  <td>
                                    {phoneNumber.number}
                                    <span className="text-capitalize"> ({phoneNumber.type})</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}

                        <PhoneNumberField
                          items={values.phoneNumbers}
                          handleRelated={this.handleRelated}
                          addresses={values.addresses}
                          onInputBlur={this.searchPhoneNumber}
                          errors={errors.phoneNumbers}
                        />
                      </div>

                      {this.renderContactSuggestion('phoneNumber')}

                      <Suggestions
                        field="phoneNumber"
                        type="contact"
                        object={values}
                        suggestions={contactSuggestions.phoneNumber}
                        display={showSuggestions.phoneNumber}
                        handleClose={this.handleClose}
                      />

                      <div className="form-field">
                        <label>Address</label>

                        {values.accounts.length > 0 && values.accounts[0].addresses.length > 0 && (
                          <table className="form-info-table m-b-10">
                            <tbody>
                              {values.accounts[0].addresses.map((address, index) => (
                                <tr key={`account-address-${address.id}`}>
                                  <td>
                                    {index === 0 && (
                                      <React.Fragment>
                                        <FontAwesomeIcon
                                          icon={['far', 'building']}
                                          data-tip={t('forms:contact.accountInfoTooltip')}
                                        />

                                        <LilyTooltip />
                                      </React.Fragment>
                                    )}
                                  </td>
                                  <td>
                                    <Address address={address} />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}

                        <AddressField
                          items={values.addresses}
                          handleRelated={this.handleRelated}
                          errors={errors.addresses}
                        />
                      </div>

                      <div className="form-field">
                        <label>Social</label>
                        <SocialMediaField
                          items={values.socialMedia}
                          handleRelated={this.handleRelated}
                          errors={errors.socialMedia}
                        />
                      </div>
                    </FormSection>

                    <FormSection header="Tags">
                      <div className="form-field">
                        <label>Tags</label>
                        <TagField items={values.tags} handleRelated={this.handleRelated} />
                      </div>
                    </FormSection>

                    <FormFooter {...this.props} confirmText="Save contact" />
                  </Form>
                </div>
              </div>
            </div>
          </BlockUI>
        ) : (
          <LoadingIndicator />
        )}
      </React.Fragment>
    );
  }
}

const ContactForm = withRouter(
  withFormik({
    mapPropsToValues: () => ({
      salutation: 0,
      gender: 0,
      firstName: '',
      lastName: '',
      accounts: [],
      description: '',
      emailAddresses: [],
      phoneNumbers: [],
      addresses: [],
      websites: [],
      tags: [],
      socialMedia: [TWITTER_EMPTY_ROW, LINKEDIN_EMPTY_ROW],
      twitter: ''
    }),
    handleSubmit: (values, { props, setSubmitting, setErrors }) => {
      const { t } = props;
      const cleanedValues = cleanRelatedFields(values);

      cleanedValues.accounts = cleanedValues.accounts.map(account => ({ id: account.id }));

      let request;
      let text;

      if (values.id) {
        request = Contact.put(cleanedValues);
        text = t('toasts:modelUpdated', { model: 'contact' });
      } else {
        request = Contact.post(cleanedValues);
        text = t('toasts:modelCreated', { model: 'contact' });
      }

      request
        .then(response => {
          successToast(text);

          if (!values.id) window.Intercom('trackEvent', 'contact-created');

          if (props.closeSidebar) {
            props.data.submitCallback(response);
            props.closeSidebar();
          } else {
            props.history.push(`/contacts/${response.id}`);
          }
        })
        .catch(errors => {
          errorToast(t('toasts:formError'));
          setErrors(errors.data);
          setSubmitting(false);
        });
    },
    displayName: 'ContactForm'
  })(InnerContactForm)
);

export default withTranslation(['forms', 'toasts'])(withContext(ContactForm));
