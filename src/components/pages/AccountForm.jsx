import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router-dom';
import { withFormik } from 'formik';
import { withNamespaces } from 'react-i18next';
import Select from 'react-select';
import AsyncSelect from 'react-select/lib/Async';

import withContext from 'src/withContext';
import formatPhoneNumber from 'utils/formatPhoneNumber';
import setValues from 'utils/setValues';
import {
  SELECT_STYLES,
  ACCOUNT_ACTIVE_STATUS,
  ACCOUNT_RELATION_STATUS,
  OTHER_EMAIL_STATUS,
  PRIMARY_EMAIL_STATUS,
  VISITING_ADDRESS_TYPE,
  MOBILE_PHONE_TYPE,
  WORK_PHONE_TYPE,
  TWITTER_EMPTY_ROW
} from 'lib/constants';
import { successToast, errorToast } from 'utils/toasts';
import ucfirst from 'utils/ucfirst';
import cleanRelatedFields from 'utils/cleanRelatedFields';
import BlockUI from 'components/Utils/BlockUI';
import Form from 'components/Form';
import FormSection from 'components/Form/FormSection';
import FormFooter from 'components/Form/FormFooter';
import LoadingIndicator from 'components/Utils/LoadingIndicator';
import EmailAddressField from 'components/Fields/EmailAddressField';
import PhoneNumberField from 'components/Fields/PhoneNumberField';
import AddressField from 'components/Fields/AddressField';
import WebsiteField from 'components/Fields/WebsiteField';
import TagField from 'components/Fields/TagField';
import Suggestions from 'components/Fields/Suggestions';
import User from 'models/User';
import Account from 'models/Account';

class InnerAccountForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accountStatuses: [],
      accountSuggestions: { name: [], emailAddress: [], phoneNumber: [] },
      contactSuggestions: { name: [], emailAddress: [], phoneNumber: [] },
      showSuggestions: { name: true, emailAddress: true, phoneNumber: true },
      loading: true
    };
  }

  async componentDidMount() {
    const { id } = this.props.match.params;

    const statusResponse = await Account.statuses();

    if (id) {
      await this.loadAccount(id);

      document.title = `${this.props.values.name} - Lily`;
    } else {
      const relation = statusResponse.results.find(
        status => status.name === ACCOUNT_RELATION_STATUS
      );

      if (relation) {
        this.props.setFieldValue('status', relation);
      }

      const { data } = this.props;

      if (data) {
        if (data.website) {
          this.props.setFieldValue('primaryWebsite', data.website);

          await this.loadDataproviderInfo();

          if (!this.props.values.name) {
            const company = data.website
              .split('.')
              .slice(0, -1)
              .join(' ');
            const companyName = ucfirst(company);

            this.props.setFieldValue('name', companyName);
          }
        } else {
          Object.keys(data).forEach(key => {
            this.props.setFieldValue(key, data[key]);
          });
        }
      }

      document.title = `Add account - Lily`;
    }

    this.props.setFieldValue('assignedTo', this.props.currentUser);

    this.setState({ accountStatuses: statusResponse.results, loading: false });
  }

  loadAccount = async (id, existingValues = null) => {
    const account = await Account.get(id);
    const primaryWebsite = account.websites.find(website => website.isPrimary);

    account.primaryWebsite = primaryWebsite ? primaryWebsite.website : '';
    account.websites = account.websites.filter(website => !website.isPrimary);

    if (existingValues) {
      if (!account.primaryWebsite) {
        this.props.setFieldValue('primaryWebsite', existingValues.primaryWebsite);
      }

      if (existingValues.description) {
        const description = `${existingValues.description}\n\n${account.description}`;
        account.description = description;
      }

      const { emailAddresses, phoneNumbers, addresses, websites, tags } = account;

      account.emailAddresses = this.concatUnique(existingValues.emailAddresses, emailAddresses, [
        'emailAddress'
      ]);
      account.phoneNumbers = this.concatUnique(existingValues.phoneNumbers, phoneNumbers, [
        'number'
      ]);
      account.addresses = this.concatUnique(existingValues.addresses, addresses, [
        'address',
        'postalCode'
      ]);
      account.websites = this.concatUnique(existingValues.websites, websites, ['website']);
      account.tags = this.concatUnique(existingValues.tags, tags, ['name']);

      const twitterProfile = account.socialMedia.find(profile => profile.name === 'twitter');

      if (!twitterProfile) account.socialMedia = existingValues.socialMedia;
    }

    setValues(account, this.props.setFieldValue);
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

  loadDataproviderInfo = async () => {
    const { values, currentUser } = this.props;
    const data = await Account.dataproviderInfo('url', values.primaryWebsite);

    if (data.error) {
      return;
    }

    // Filter out empty items (default form values).
    const emailAddresses = values.emailAddresses.filter(emailAddress => emailAddress.emailAddress);

    data.emailAddresses.forEach(emailAddress => {
      const exists = emailAddresses.some(
        accountEmail => emailAddress === accountEmail.email_address
      );

      // Only add items which haven't been added yet.
      if (!exists) {
        if (data.primaryEmail && data.primaryEmail === emailAddress) {
          emailAddresses.unshift({ emailAddress, status: PRIMARY_EMAIL_STATUS });
        } else {
          emailAddresses.push({ emailAddress, status: OTHER_EMAIL_STATUS });
        }
      }
    });

    if (emailAddresses.length) {
      data.emailAddresses = emailAddresses;
    }

    // Filter out empty items (default form values).
    const addresses = values.addresses.filter(address => address.address);

    data.addresses.forEach(address => {
      if (!address.type) {
        address.type = VISITING_ADDRESS_TYPE;
      }

      const exists = addresses.some(
        accountAddress => JSON.stringify(address) === JSON.stringify(accountAddress)
      );

      if (!exists) {
        addresses.push(address);
      }
    });

    if (addresses.length > 0) {
      data.addresses = addresses;
    }

    // Filter out empty items (default form values).
    const phoneNumbers = values.phoneNumbers.filter(phoneNumber => phoneNumber.number);

    data.phoneNumbers.forEach(phoneNumber => {
      const exists = phoneNumbers.some(accountNumber => phoneNumber === accountNumber.number);

      if (!exists) {
        const address = data.addresses.length ? data.addresses[0] : null;
        const { formatted, isMobile } = formatPhoneNumber(phoneNumber, currentUser, address);

        if (formatted) {
          phoneNumbers.push({
            number: formatted,
            type: isMobile ? MOBILE_PHONE_TYPE : WORK_PHONE_TYPE
          });
        }
      }
    });

    if (phoneNumbers.length) {
      data.phoneNumbers = phoneNumbers;
    }

    data.websites = values.websites;
    data.tags = [];

    setValues(data, this.props.setFieldValue);
  };

  search = async query => {
    // TODO: This needs to have search query and sorting implemented.
    // Search the given model with the search query and any specific sorting.
    const request = await User.query({ query });

    return request.results;
  };

  searchName = async () => {
    const { accountSuggestions, showSuggestions } = this.state;
    const { name } = this.props.values;

    if (!this.props.values.id) {
      // TODO: Change this to new way of searching.
      const filterquery = `name: "${name}"`;
      const response = await Account.search(filterquery);

      if (response.hits.length > 0) {
        accountSuggestions.name = response.hits;
      }

      showSuggestions.name = true;

      this.setState({ accountSuggestions, showSuggestions });
    }
  };

  searchEmailAddress = async emailAddress => {
    const { accountSuggestions, contactSuggestions, showSuggestions } = this.state;

    if (!this.props.values.id && emailAddress) {
      // There was a call for the current user,
      // so try to find an account with the given email address.
      const response = await Account.searchByEmailAddress(emailAddress);
      const { type } = response;

      if (type === 'account') {
        const exists = accountSuggestions.emailAddress.some(
          suggestion => suggestion.account.id === response.data.id
        );

        if (!exists) {
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
      // There was a call for the current user,
      // so try to find an account or contact with the given number.
      const response = await Account.searchByPhoneNumber(phoneNumber);

      if (response.data.account) {
        const { account } = response.data;
        const exists = accountSuggestions.phoneNumber.some(
          suggestion => suggestion.account.id === account.id
        );

        if (!exists) {
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

  handleRelated = (type, items) => {
    this.props.setFieldValue(type, items);
  };

  handleCustomerID = event => {
    const { status } = this.props.values;

    if (status && status.name === ACCOUNT_RELATION_STATUS) {
      // Setting a customer ID usually means the account is already an active customer.
      const activeStatus = this.state.accountStatuses.find(
        statusItem => statusItem.name === ACCOUNT_ACTIVE_STATUS
      );
      this.props.setFieldValue('status', activeStatus);
    }

    this.props.handleChange(event);
  };

  handleSocialMedia = event => {
    const { socialMedia } = this.props.values;
    // Get the ID of the input and change the value based on that ID.
    socialMedia.forEach(profile => {
      if (profile.name === event.target.id) {
        profile.username = event.target.value;
      }
    });

    this.props.setFieldValue('socialMedia', socialMedia);
  };

  merge = async accountId => {
    const { accountSuggestions } = this.state;
    const existingValues = this.props.values;
    const response = await Account.get(accountId);

    await this.loadAccount(response.id, existingValues);

    this.props.history.push(`/accounts/${response.id}/edit`);

    // Clear the suggestions.
    Object.keys(accountSuggestions).forEach(key => {
      accountSuggestions[key] = {};
    });

    this.setState({ accountSuggestions });
  };

  render() {
    const {
      accountStatuses,
      accountSuggestions,
      contactSuggestions,
      showSuggestions,
      loading
    } = this.state;
    const { values, errors, isSubmitting, handleChange, handleSubmit } = this.props;

    const twitterProfile = values.socialMedia.find(profile => profile.name === 'twitter');
    const twitterUsername = twitterProfile ? twitterProfile.username : '';

    return (
      <React.Fragment>
        {!loading ? (
          <BlockUI blocking={isSubmitting}>
            <div className="content-block-container">
              <div className="content-block">
                <div className="content-block-header">
                  <div className="content-block-name">
                    {values.id ? (
                      <React.Fragment>Edit account</React.Fragment>
                    ) : (
                      <React.Fragment>Add account</React.Fragment>
                    )}
                  </div>
                </div>

                <div className="content-block-content">
                  <Form handleSubmit={handleSubmit}>
                    <FormSection header="Who was it?">
                      <div className="form-field">
                        <label htmlFor="primaryWebsite">Primary website</label>

                        <div className="input-addon">
                          <input
                            id="primaryWebsite"
                            type="text"
                            className="hl-input"
                            placeholder="www.example.com"
                            value={values.primaryWebsite || ''}
                            onChange={handleChange}
                          />
                          <button
                            className="hl-primary-btn"
                            onClick={this.loadDataproviderInfo}
                            type="button"
                          >
                            <FontAwesomeIcon icon="magic" />
                          </button>
                        </div>
                      </div>

                      <div className={`form-field${errors.name ? ' has-error' : ''}`}>
                        <label htmlFor="name" required>
                          Company name
                        </label>
                        <input
                          id="name"
                          type="text"
                          className="hl-input"
                          placeholder="Company name"
                          value={values.name}
                          onChange={handleChange}
                          onBlur={this.searchName}
                        />

                        {errors.name && <div className="error-message">{errors.name}</div>}
                      </div>

                      <Suggestions
                        field="name"
                        type="account"
                        suggestions={accountSuggestions.name}
                        display={showSuggestions.name}
                        handleMerge={this.merge}
                        handleClose={this.handleClose}
                      />

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

                      <div className="form-field">
                        <label htmlFor="customerId">Customer ID</label>
                        <input
                          id="customerId"
                          type="text"
                          className="hl-input"
                          placeholder="Customer ID"
                          value={values.customerId}
                          onChange={this.handleCustomerID}
                        />
                      </div>

                      <div className={`form-field${errors.status ? ' has-error' : ''}`}>
                        <label htmlFor="status">Status</label>
                        <Select
                          name="status"
                          classNamePrefix="editable-input"
                          value={values.status}
                          styles={SELECT_STYLES}
                          onChange={value => this.props.setFieldValue('status', value)}
                          options={accountStatuses}
                          getOptionLabel={option => option.name}
                          getOptionValue={option => option.id}
                        />

                        {errors.status && <div className="error-message">{errors.status}</div>}
                      </div>
                    </FormSection>

                    <FormSection header="Who is handling the account?">
                      <div className={`form-field${errors.assignedTo ? ' has-error' : ''}`}>
                        <label htmlFor="assignedTo">Assigned to</label>
                        <AsyncSelect
                          defaultOptions
                          name="assignedTo"
                          classNamePrefix="editable-input"
                          value={values.assignedTo}
                          styles={SELECT_STYLES}
                          onChange={value => this.props.setFieldValue('assignedTo', value)}
                          loadOptions={this.search}
                          getOptionLabel={option => option.fullName}
                          getOptionValue={option => option.id}
                        />

                        {errors.assignedTo && (
                          <div className="error-message">{errors.assignedTo}</div>
                        )}
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

                      <div className="form-field">
                        <label>Extra website</label>
                        <WebsiteField
                          items={values.websites}
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
                    </FormSection>

                    <FormFooter {...this.props} />
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

const AccountForm = withRouter(
  withFormik({
    mapPropsToValues: () => ({
      primaryWebsite: '',
      name: '',
      description: '',
      customerId: '',
      status: null,
      assignedTo: null,
      emailAddresses: [],
      phoneNumbers: [],
      addresses: [],
      websites: [],
      tags: [],
      socialMedia: [TWITTER_EMPTY_ROW],
      twitter: ''
    }),
    handleSubmit: (values, { props, setSubmitting, setErrors }) => {
      const { t } = props;
      const cleanedValues = cleanRelatedFields(values);

      // TODO: Clean this up (util function or w/e).
      if (cleanedValues.status) {
        cleanedValues.status = { id: cleanedValues.status.id };
      }

      // TODO: Clean this up (util function or w/e).
      if (cleanedValues.assignedTo) {
        cleanedValues.assignedTo = { id: cleanedValues.assignedTo.id };
      }

      let request;
      let text;

      if (values.id) {
        request = Account.patch(cleanedValues);
        text = t('modelUpdated', { model: 'account' });
      } else {
        request = Account.post(cleanedValues);
        text = t('modelCreated', { model: 'account' });
      }

      request
        .then(response => {
          if (props.closeSidebar) {
            props.closeSidebar();
          }

          successToast(text);

          if (!values.id) window.Intercom('trackEvent', 'account-created');

          props.history.push(`/accounts/${response.id}`);
        })
        .catch(errors => {
          errorToast(t('error'));
          setErrors(errors.data);
          setSubmitting(false);
        });
    },
    displayName: 'AccountForm'
  })(InnerAccountForm)
);

export default withNamespaces('toasts')(withContext(AccountForm));
