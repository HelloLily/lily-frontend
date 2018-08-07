import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router-dom';
import { withFormik } from 'formik';
import Select from 'react-select';
import AsyncSelect from 'react-select/lib/Async';

import { get } from 'lib/api';
import formatPhoneNumber from 'utils/formatPhoneNumber';
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
import cleanRelatedFields from 'utils/cleanRelatedFields';
import BlockUI from 'components/Utils/BlockUI';
import FormSection from 'components/Utils/FormSection';
import FormFooter from 'components/Utils/FormFooter';
import EmailAddressField from 'components/Fields/EmailAddressField';
import PhoneNumberField from 'components/Fields/PhoneNumberField';
import AddressField from 'components/Fields/AddressField';
import WebsiteField from 'components/Fields/WebsiteField';
import TagField from 'components/Fields/TagField';
import Suggestions from 'components/Fields/Suggestions';
import Account from 'models/Account';

class InnerAccountForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accountStatuses: [],
      accountSuggestions: { name: [], emailAddress: [], phoneNumber: [] },
      contactSuggestions: { name: [], emailAddress: [], phoneNumber: [] },
      showSuggestions: { name: true, emailAddress: true, phoneNumber: true }
    };
  }

  async componentDidMount() {
    const { id } = this.props.match.params;

    const statusResponse = await Account.statuses();

    if (id) {
      const accountResponse = await Account.get(id);

      this.props.setValues(accountResponse);
    } else {
      const relation = statusResponse.results.find(
        status => status.name === ACCOUNT_RELATION_STATUS
      );

      if (relation) {
        this.props.setFieldValue('status', relation);
      }
    }

    this.setState({ accountStatuses: statusResponse.results });
  }

  getDataproviderInfo = async () => {
    // TODO: Actual user should be used here.
    const user = { country: 'NL' };
    const { values } = this.props;
    const data = await Account.dataproviderInfo(values.primaryWebsite);

    // Filter out empty items (default form values).
    const emailAddresses = values.emailAddresses.filter(emailAddress => emailAddress.email_address);

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

    if (addresses.length) {
      data.addresses = addresses;
    }

    // Filter out empty items (default form values).
    const phoneNumbers = values.phoneNumbers.filter(phoneNumber => phoneNumber.number);

    data.phoneNumbers.forEach(phoneNumber => {
      const exists = phoneNumbers.some(accountNumber => phoneNumber === accountNumber.number);

      if (!exists) {
        const address = data.addresses.length ? data.addresses[0] : null;
        const { formatted, isMobile } = formatPhoneNumber(phoneNumber, user, address);

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

    this.props.setValues(data);
  };

  search = async query => {
    // TODO: This needs to have search query and sorting implemented.
    // Search the given model with the search query and any specific sorting.
    const request = await get(`/users/`);

    return request.results;
  };

  searchName = async () => {
    const { accountSuggestions, showSuggestions } = this.state;
    const { name } = this.props.values;

    if (!this.props.values.id) {
      const filterquery = `name:"${name}"`;

      // TODO: Change this to new way of searching.
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
      // There was a call for the current user, so try to find an account with the given email address.
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
      // There was a call for the current user, so try to find an account or contact with the given number.
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
    // Get the ID of the input and change the value based on that ID.
    const socialMediaProfile = this.props.values.socialMedia.find(
      profile => profile.name === event.target.id
    );

    socialMediaProfile.username = event.target.value;

    this.props.setFieldValue('socialMedia', [...this.props.values.socialMedia, socialMediaProfile]);
  };

  merge = async accountId => {
    const response = await Account.get(accountId);
    this.props.setValues(response);

    const { accountSuggestions } = this.state;

    // Clear the suggestions.
    Object.keys(accountSuggestions).forEach(key => {
      accountSuggestions[key] = {};
    });
  };

  render() {
    const { accountStatuses, accountSuggestions, contactSuggestions, showSuggestions } = this.state;
    const { values, errors, isSubmitting, handleChange, handleSubmit } = this.props;

    const twitterProfile = values.socialMedia.find(profile => profile.type === 'twitter');
    const twitterUsername = twitterProfile ? twitterProfile.username : '';

    return (
      <BlockUI blocking={isSubmitting}>
        <div className="content-block-container">
          <div className="content-block">
            <div className="content-block-header">
              <div className="content-block-name">Add account</div>
            </div>

            <div className="content-block-content">
              <form onSubmit={handleSubmit}>
                <FormSection header="Who was it?">
                  <div className="form-field">
                    <label htmlFor="primaryWebsite">Primary website</label>

                    <div className="input-addon">
                      <input
                        id="primaryWebsite"
                        type="text"
                        className="hl-input"
                        placeholder="www.example.com"
                        value={values.primaryWebsite}
                        onChange={handleChange}
                      />
                      <button
                        className="hl-primary-btn"
                        onClick={this.getDataproviderInfo}
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
                      getOptionValue={option => option.name}
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
                      getOptionValue={option => option.fullName}
                    />

                    {errors.assignedTo && <div className="error-message">{errors.assignedTo}</div>}
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
              </form>
            </div>
          </div>
        </div>
      </BlockUI>
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
    // validationSchema: Yup.object().shape({
    //   email: Yup.string()
    //     .email('Invalid email address')
    //     .required('Email is required!'),
    // }),
    handleSubmit: (values, { props, setSubmitting, setErrors }) => {
      const cleanedValues = cleanRelatedFields(values);

      // TODO: Clean this up (util function or w/e).
      if (cleanedValues.status) {
        cleanedValues.status = { id: cleanedValues.status.id };
      }

      // TODO: Clean this up (util function or w/e).
      if (cleanedValues.assignedTo) {
        cleanedValues.assignedTo = { id: cleanedValues.assignedTo.id };
      }

      const request = values.id ? Account.patch(cleanedValues) : Account.post(cleanedValues);

      request
        .then(response => {
          if (props.closeSidebar) {
            props.closeSidebar();
          }

          props.history.push(`/accounts/${response.id}`);
        })
        .catch(errors => {
          setErrors(errors.data);
          setSubmitting(false);
        });
    },
    displayName: 'AccountForm'
  })(InnerAccountForm)
);

export default AccountForm;
