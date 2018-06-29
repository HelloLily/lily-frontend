import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
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
      accountSuggestions: { name: [], email: [], phone: [] },
      contactSuggestions: { name: [], email: [], phone: [] },
      showSuggestions: { name: true, email: true, phone: true }
    };
  }

  async componentDidMount() {
    const statusData = await Account.statuses();

    const relation = statusData.results.find(status => status.name === ACCOUNT_RELATION_STATUS);

    if (relation) {
      this.props.setFieldValue('status', relation);
    }

    this.setState({ accountStatuses: statusData.results });
  }

  getDataproviderInfo = async () => {
    // TODO: Actual user should be used here.
    const user = { country: 'NL' };
    const { values } = this.props;
    const data = await Account.getDataproviderInfo(values.primaryWebsite);

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
      const exists = accountSuggestions.name.some(
        suggestion => suggestion.account.id === response.data.id
      );

      if (!exists && response.hits.length > 0) {
        accountSuggestions.name.push({ name, account: response.hits[0] });
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
        const exists = accountSuggestions.email.some(
          suggestion => suggestion.account.id === response.data.id
        );

        if (!exists) {
          accountSuggestions.email.push({ emailAddress, account: response.data });
        }

        showSuggestions.email = true;
      } else if (type === 'contact') {
        const exists = contactSuggestions.email.some(
          suggestion => suggestion.contact.id === response.data.id
        );

        if (!exists) {
          contactSuggestions.email.push({ emailAddress, contact: response.data });
        }

        showSuggestions.email = true;
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
        const exists = accountSuggestions.phone.some(
          suggestion => suggestion.account.id === account.id
        );

        if (!exists) {
          accountSuggestions.phone.push({ phoneNumber, account });
        }

        showSuggestions.phone = true;
      } else if (response.data.contact) {
        const { contact } = response.data;
        const exists = contactSuggestions.phone.some(
          suggestion => suggestion.contact.id === contact.id
        );

        if (!exists) {
          contactSuggestions.phone.push({ phoneNumber, contact });
        }

        showSuggestions.phone = true;
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
    const { values, errors, dirty, isSubmitting, handleChange, handleSubmit } = this.props;

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
                        placeholder="www.example.com"
                        type="text"
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
                      placeholder="Company name"
                      type="text"
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
                      placeholder="Customer ID"
                      type="text"
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
                      onChange={handleChange}
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
                    suggestions={accountSuggestions.email}
                    display={showSuggestions.email}
                    handleMerge={this.merge}
                  />

                  <Suggestions
                    field="emailAddress"
                    type="contact"
                    suggestions={contactSuggestions.email}
                    display={showSuggestions.email}
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
                    suggestions={accountSuggestions.phone}
                    display={showSuggestions.phone}
                    handleMerge={this.merge}
                  />

                  <Suggestions
                    field="phoneNumber"
                    type="contact"
                    suggestions={contactSuggestions.phone}
                    display={showSuggestions.phone}
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
                    <input
                      id="twitter"
                      placeholder="Twitter"
                      type="text"
                      value={values.socialMedia[0].username}
                      onChange={this.handleSocialMedia}
                    />
                  </div>
                </FormSection>

                <div className="form-footer">
                  <button type="submit" disabled={isSubmitting} className="hl-primary-btn-blue">
                    <FontAwesomeIcon icon="check" /> Save
                  </button>

                  <button
                    type="button"
                    className="hl-primary-btn m-l-10"
                    disabled={!dirty || isSubmitting}
                  >
                    Cancel
                  </button>
                </div>
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

      const request = Account.post(cleanedValues);

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
