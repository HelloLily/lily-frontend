import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router-dom';
import { withFormik } from 'formik';
import AsyncSelect from 'react-select/lib/Async';

import { get } from 'lib/api';
import withContext from 'src/withContext';
import {
  SELECT_STYLES,
  TWITTER_EMPTY_ROW,
  LINKEDIN_EMPTY_ROW,
  ACCOUNT_RELATION_STATUS
} from 'lib/constants';
import cleanRelatedFields from 'utils/cleanRelatedFields';
import RadioButtons from 'components/RadioButtons';
import BlockUI from 'components/Utils/BlockUI';
import FormSection from 'components/Utils/FormSection';
import FormFooter from 'components/Utils/FormFooter';
import EmailAddressField from 'components/Fields/EmailAddressField';
import PhoneNumberField from 'components/Fields/PhoneNumberField';
import AddressField from 'components/Fields/AddressField';
import TagField from 'components/Fields/TagField';
import Suggestions from 'components/Fields/Suggestions';
import Account from 'models/Account';
import Contact from 'models/Contact';

class InnerContactForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accountSuggestions: { name: [], emailAddress: [], phoneNumber: [] },
      contactSuggestions: { name: [], emailAddress: [], phoneNumber: [] },
      showSuggestions: { name: true, emailAddress: true, phoneNumber: true }
    };
  }

  async componentDidMount() {
    const { id } = this.props.match.params;

    if (id) {
      const contactResponse = await Contact.get(id);

      this.props.setValues(contactResponse);
    }
  }

  NoOptionsMessage = props => {
    const value = props.selectProps.inputValue;

    return (
      <button onClick={() => this.addAccount(props)} type="button" className="no-options-action">
        <FontAwesomeIcon icon="plus" /> Add <strong>{value}</strong> as a new account
      </button>
    );
  };

  searchName = async () => {
    const { contactSuggestions, showSuggestions } = this.state;
    const { firstName, lastName } = this.props.values;

    if (!this.props.values.id && firstName && lastName) {
      const filterquery = `full_name:"${firstName} ${lastName}"`;

      // TODO: Change this to new way of searching.
      const response = await Contact.search(filterquery);

      if (response.hits.length > 0) {
        contactSuggestions.name = response.hits;
      }

      showSuggestions.name = true;

      this.setState({ contactSuggestions, showSuggestions });
    }
  };

  searchEmailAddress = async emailAddress => {
    const { accountSuggestions, contactSuggestions, showSuggestions } = this.state;

    if (!this.props.values.id && emailAddress) {
      // There was a call for the current user, so try to find an account with the given email address.
      const response = await Account.searchByEmailAddress(emailAddress);
      const { type } = response;

      if (type === 'account') {
        const exists = accountSuggestions.emailAddress.some(
          suggestion => suggestion.account.id === response.data.id
        );

        const alreadyAdded = this.props.values.accounts.some(
          contactAccount => contactAccount.id === response.data.id
        );

        if (!exists && !alreadyAdded) {
          accountSuggestions.emailAddress.push({ emailAddress, account: response.data });
        }

        showSuggestions.emailAddress = true;
      } else if (type === 'contact') {
        const exists = contactSuggestions.emailAddress.some(
          suggestion => suggestion.contact.id === response.data.id
        );

        if (!exists) {
          contactSuggestions.emailAddress.push({ emailAddress, contact: response.data });
        }

        showSuggestions.emailAddress = true;
      }
    }

    this.setState({ accountSuggestions, contactSuggestions, showSuggestions });
  };

  searchPhoneNumber = async phoneNumber => {
    const { accountSuggestions, contactSuggestions, showSuggestions } = this.state;

    if (!this.props.values.id && phoneNumber) {
      // There was a call for the current user, so try to find an account or contact with the given number.
      const response = await Account.searchByPhoneNumber(phoneNumber);

      if (response.data.account) {
        const { account } = response.data;
        const exists = accountSuggestions.phoneNumber.some(
          suggestion => suggestion.account.id === account.id
        );
        const alreadyAdded = this.props.values.accounts.some(
          contactAccount => contactAccount.id === response.data.id
        );

        if (!exists && !alreadyAdded) {
          accountSuggestions.phoneNumber.push({ phoneNumber, account });
        }

        showSuggestions.phoneNumber = true;
      } else if (response.data.contact) {
        const { contact } = response.data;
        const exists = contactSuggestions.phoneNumber.some(
          suggestion => suggestion.contact.id === contact.id
        );

        if (!exists) {
          contactSuggestions.phoneNumber.push({ phoneNumber, contact });
        }

        showSuggestions.phoneNumber = true;
      }

      this.setState({ accountSuggestions, contactSuggestions, showSuggestions });
    }
  };

  searchAccounts = async query => {
    // TODO: This needs to have search query and sorting implemented.
    // Search the given model with the search query and any specific sorting.
    const request = await get(`/accounts/`);

    return request.results;
  };

  handleAccounts = selected => {
    this.props.setFieldValue('accounts', selected);
  };

  addAccount = async props => {
    const name = props.selectProps.inputValue;

    // TODO: Implement filtering through url parameter;
    const statusRequest = await Account.statuses();
    const relationStatus = statusRequest.results.find(
      status => status.name === ACCOUNT_RELATION_STATUS
    );

    const data = {
      name,
      status: relationStatus.id,
      assignedTo: this.props.currentUser
    };

    // Create a new account and add it to the 'Works at' field.
    const response = await Account.post(data);

    props.setValue([...this.props.values.accounts, response]);
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

  merge = async contactId => {
    const response = await Contact.get(contactId);
    this.props.setValues(response);

    const { contactSuggestions } = this.state;

    // Clear the suggestions.
    Object.keys(contactSuggestions).forEach(key => {
      contactSuggestions[key] = {};
    });
  };

  render() {
    const { accountSuggestions, contactSuggestions, showSuggestions } = this.state;
    const { values, errors, isSubmitting, handleChange, handleSubmit } = this.props;

    const twitterProfile = values.socialMedia.find(profile => profile.type === 'twitter');
    const twitterUsername = twitterProfile ? twitterProfile.username : '';

    const linkedInProfile = values.socialMedia.find(profile => profile.type === 'linkedin');
    const linkedInUsername = linkedInProfile ? linkedInProfile.username : '';

    return (
      <BlockUI blocking={isSubmitting}>
        <div className="content-block-container">
          <div className="content-block">
            <div className="content-block-header">
              <div className="content-block-name">Add contact</div>
            </div>

            <div className="content-block-content">
              <form onSubmit={handleSubmit}>
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

                        {errors.lastName && <div className="error-message">{errors.lastName}</div>}
                      </div>
                    </div>
                  </div>

                  <Suggestions
                    field="name"
                    type="contact"
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
                      loadOptions={this.searchAccounts}
                      getOptionLabel={option => option.name}
                      getOptionValue={option => option.name}
                      components={{ NoOptionsMessage: this.NoOptionsMessage }}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      placeholder="Description"
                      rows="3"
                      value={values.description}
                      onChange={handleChange}
                    />
                  </div>
                </FormSection>

                <FormSection header="Contact information">
                  <div className="form-field">
                    <label>Email address</label>
                    <EmailAddressField
                      items={values.emailAddresses}
                      handleRelated={this.handleRelated}
                      onInputBlur={this.searchEmailAddress}
                      errors={errors}
                    />
                  </div>

                  <Suggestions
                    field="emailAddress"
                    type="account"
                    suggestions={accountSuggestions.emailAddress}
                    display={showSuggestions.emailAddress}
                    handleMerge={this.merge}
                    handleClose={this.handleClose}
                  />

                  <Suggestions
                    field="emailAddress"
                    type="contact"
                    suggestions={contactSuggestions.emailAddress}
                    display={showSuggestions.emailAddress}
                    handleClose={this.handleClose}
                  />

                  <div className="form-field">
                    <label>Phone number</label>
                    <PhoneNumberField
                      items={values.phoneNumbers}
                      handleRelated={this.handleRelated}
                      addresses={values.addresses}
                      onInputBlur={this.searchPhoneNumber}
                      errors={errors}
                    />
                  </div>

                  <Suggestions
                    field="phoneNumber"
                    type="account"
                    suggestions={accountSuggestions.phoneNumber}
                    display={showSuggestions.phoneNumber}
                    handleMerge={this.merge}
                    handleClose={this.handleClose}
                  />

                  <Suggestions
                    field="phoneNumber"
                    type="contact"
                    suggestions={contactSuggestions.phoneNumber}
                    display={showSuggestions.phoneNumber}
                    handleClose={this.handleClose}
                  />

                  <div className="form-field">
                    <label>Address</label>
                    <AddressField
                      items={values.addresses}
                      handleRelated={this.handleRelated}
                      errors={errors}
                    />
                  </div>
                </FormSection>

                <FormSection header="Tags">
                  <div className="form-field">
                    <label>Tags</label>
                    <TagField items={values.tags} handleRelated={this.handleRelated} />
                  </div>
                </FormSection>

                <FormSection header="Social">
                  <div className="form-field">
                    <label htmlFor="twitter">Twitter</label>
                    <div className="input-addon">
                      <div className="input-addon-icon">
                        <FontAwesomeIcon icon={['fab', 'twitter']} />
                      </div>
                      <input
                        id="twitter"
                        type="text"
                        className="hl-input"
                        placeholder="Twitter"
                        value={twitterUsername}
                        onChange={this.handleSocialMedia}
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="linkedin">LinkedIn</label>

                    <div className="input-addon">
                      <div className="input-addon-icon">
                        <FontAwesomeIcon icon={['fab', 'linkedin-in']} />
                      </div>
                      <input
                        id="linkedin"
                        type="text"
                        className="hl-input"
                        placeholder="LinkedIn"
                        value={linkedInUsername}
                        onChange={this.handleSocialMedia}
                      />
                    </div>
                  </div>
                </FormSection>

                <FormFooter {...this.props} />
              </form>
            </div>
          </div>
        </div>
      </BlockUI>
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
      const cleanedValues = cleanRelatedFields(values);

      cleanedValues.accounts = cleanedValues.accounts.map(account => ({ id: account.id }));

      const request = values.id ? Contact.patch(cleanedValues) : Contact.post(cleanedValues);

      request
        .then(response => {
          if (props.closeSidebar) {
            props.closeSidebar();
          }

          props.history.push(`/contacts/${response.id}`);
        })
        .catch(errors => {
          setErrors(errors.data);
          setSubmitting(false);
        });
    },
    displayName: 'ContactForm'
  })(InnerContactForm)
);

export default withContext(ContactForm);
