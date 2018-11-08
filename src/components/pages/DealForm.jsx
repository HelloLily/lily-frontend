import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withFormik } from 'formik';
import { withNamespaces } from 'react-i18next';
import { format } from 'date-fns';
import Select, { components } from 'react-select';
import AsyncSelect from 'react-select/lib/Async';

import withContext from 'src/withContext';
import {
  SELECT_STYLES,
  FORM_DATE_FORMAT,
  DEAL_WON_STATUS,
  DEAL_LOST_STATUS,
  DEAL_NONE_STEP,
  API_DATE_FORMAT
} from 'lib/constants';
import { successToast, errorToast } from 'utils/toasts';
import addBusinessDays from 'utils/addBusinessDays';
import RadioButtons from 'components/RadioButtons';
import BlockUI from 'components/Utils/BlockUI';
import Form from 'components/Form';
import FormSection from 'components/Form/FormSection';
import FormFooter from 'components/Form/FormFooter';
import TagField from 'components/Fields/TagField';
import LilyDatepicker from 'components/Utils/LilyDatePicker';
import LoadingIndicator from 'components/Utils/LoadingIndicator';
import Utils from 'models/Utils';
import Account from 'models/Account';
import Contact from 'models/Contact';
import User from 'models/User';
import UserTeam from 'models/UserTeam';
import Deal from 'models/Deal';

class InnerDealForm extends Component {
  constructor(props) {
    super(props);

    this.originalDate = props.values.id ? new Date(props.values.nextStepDate) : new Date();

    this.state = {
      nextSteps: [],
      foundThrough: [],
      contactedBy: [],
      whyCustomer: [],
      whyLost: [],
      statuses: [],
      currencies: [],
      dealSuggestions: [],
      showSuggestions: true,
      loading: true
    };
  }

  async componentDidMount() {
    const { currentUser, data, setFieldValue } = this.props;

    const nextStepResponse = await Deal.nextSteps();
    const foundThroughResponse = await Deal.foundThrough();
    const contactedByResponse = await Deal.contactedBy();
    const whyCustomerResponse = await Deal.whyCustomer();
    const whyLostResponse = await Deal.whyLost();
    const statusResponse = await Deal.statuses();
    const currencyResponse = await Utils.currencies();

    this.setState({
      nextSteps: nextStepResponse.results,
      foundThrough: foundThroughResponse.results,
      contactedBy: contactedByResponse.results,
      whyCustomer: whyCustomerResponse.results,
      whyLost: whyLostResponse.results,
      statuses: statusResponse.results,
      currencies: currencyResponse.results
    });

    this.wonStatus = statusResponse.results.find(status => status.name === DEAL_WON_STATUS);
    this.lostStatus = statusResponse.results.find(status => status.name === DEAL_LOST_STATUS);
    this.noneStep = nextStepResponse.results.find(nextStep => nextStep.name === DEAL_NONE_STEP);

    const { id } = this.props.match.params;

    if (id) {
      await this.loadDeal(id);

      document.title = `${this.props.values.name} - Lily`;
    } else {
      setFieldValue('assignedToTeams', currentUser.teams);
      setFieldValue('assignedTo', currentUser);

      if (data.object) {
        setFieldValue(data.object.contentType.model, data.model);
      }

      if (this.props.data) {
        Object.keys(this.props.data).forEach(key => {
          setFieldValue(key, this.props.data[key]);
        });
      }

      document.title = 'Add deal - Lily';
    }

    this.setState({ loading: false });
  }

  loadDeal = async id => {
    const { currencies } = this.state;

    const dealResponse = await Deal.get(id);

    if (!dealResponse.nextStepDate) {
      dealResponse.nextStepDate = '';
    }

    if (dealResponse.account && dealResponse.account.isDeleted) {
      dealResponse.account = null;
    }

    if (dealResponse.contact && dealResponse.contact.isDeleted) {
      dealResponse.contact = null;
    }

    dealResponse.currency = currencies.find(currency => currency.code === dealResponse.currency);

    this.props.setValues(dealResponse);
  };

  editDeal = async id => {
    await this.loadDeal(id);

    this.props.history.push(`/deals/${id}/edit`);

    // Clear the suggestions.
    this.setState({ dealSuggestions: [] });
  };

  IconValue = props => (
    <components.SingleValue {...props}>
      <i className={`lilicon step-type position-${props.data.position} m-r-5`} />

      {props.data.name}
    </components.SingleValue>
  );

  IconOption = props => (
    <components.Option {...props}>
      <i className={`lilicon step-type position-${props.data.position} m-r-5`} />

      {props.data.name}

      {props.data.dateIncrement > 0 && (
        <span className="text-muted small">{` (+ ${props.data.dateIncrement} days)`}</span>
      )}
    </components.Option>
  );

  searchName = async () => {
    const { contactSuggestions, showSuggestions } = this.state;
    const { subject } = this.props.values;

    if (!this.props.values.id && subject) {
      const filterquery = `subject:${subject}`;
      // TODO: Change this to new way of searching.
      const response = await Deal.search(filterquery);

      if (response.hits.length > 0) {
        contactSuggestions.name = response.hits;
      }

      showSuggestions.name = true;

      this.setState({ contactSuggestions, showSuggestions });
    }
  };

  searchAccounts = async query => {
    // TODO: This needs to have search query and sorting implemented.
    // Search the given model with the search query and any specific sorting.
    const request = await Account.query({ name: query });

    return request.results;
  };

  searchContacts = async query => {
    // TODO: This needs to have search query and sorting implemented.
    // Search the given model with the search query and any specific sorting.
    const request = await Contact.query({ fullName: query });

    return request.results;
  };

  searchTeams = async query => {
    // TODO: This needs to have search query and sorting implemented.
    // Search the given model with the search query and any specific sorting.
    const request = await UserTeam.query({ query });

    return request.results;
  };

  searchUsers = async query => {
    // TODO: This needs to have search query and sorting implemented.
    // Search the given model with the search query and any specific sorting.
    const request = await User.query({ query });

    return request.results;
  };

  handleStatus = value => {
    if (this.lostStatus && value === this.lostStatus && this.noneStep) {
      this.props.setFieldValue('nextStep', this.noneStep);
      this.props.setFieldValue('nextStepDate', '');
    }

    this.props.setFieldValue('status', value);
  };

  handleNextStep = value => {
    if (value === this.noneStep) {
      // Clear next step date when there is no next step.
      this.props.setFieldValue('nextStepDate', '');
    } else if (value.dateIncrement !== 0) {
      const newDate = addBusinessDays(value.dateIncrement, this.originalDate);
      const formattedDate = format(newDate, FORM_DATE_FORMAT);

      this.props.setFieldValue('nextStepDate', formattedDate);
    }

    this.props.setFieldValue('nextStep', value);
  };

  handleRelated = (type, items) => {
    this.props.setFieldValue(type, items);
  };

  handleClose = field => {
    const { showSuggestions } = this.state;
    showSuggestions[field] = false;

    this.setState({ showSuggestions });
  };

  handleAccount = async value => {
    this.props.setFieldValue('account', value);

    const args = {
      account: value.id
    };

    if (value.contacts.length === 1) {
      this.props.setFieldValue('contact', value.contacts[0]);

      args.contact = value.contacts[0].id;
    }

    const dealResponse = await Deal.openDeals(args);

    this.setState({ dealSuggestions: dealResponse.results, showSuggestions: true });
  };

  handleContact = value => {
    this.props.setFieldValue('contact', value);
  };

  handleAssignedTo = value => {
    this.props.setFieldValue('assignedTo', value);

    const assignedTeams = value.teams.map(team => team);

    this.props.setFieldValue('assignedToTeams', assignedTeams);
  };

  render() {
    const {
      nextSteps,
      foundThrough,
      contactedBy,
      whyCustomer,
      whyLost,
      statuses,
      currencies,
      dealSuggestions,
      showSuggestions,
      loading
    } = this.state;
    const {
      values,
      errors,
      isSubmitting,
      handleChange,
      handleSubmit,
      setFieldValue,
      t
    } = this.props;

    return (
      <React.Fragment>
        {!loading ? (
          <BlockUI blocking={isSubmitting}>
            <div className="content-block-container">
              <div className="content-block">
                <div className="content-block-header">
                  <div className="content-block-name">
                    {values.id ? (
                      <React.Fragment>Edit deal</React.Fragment>
                    ) : (
                      <React.Fragment>Add deal</React.Fragment>
                    )}
                  </div>
                </div>

                <div className="content-block-content">
                  <Form handleSubmit={handleSubmit}>
                    <FormSection header="Who is it?">
                      <div className={`form-field${errors.account ? ' has-error' : ''}`}>
                        <label htmlFor="account">Account</label>
                        <AsyncSelect
                          defaultOptions
                          name="account"
                          value={values.account}
                          styles={SELECT_STYLES}
                          onChange={this.handleAccount}
                          loadOptions={this.searchAccounts}
                          getOptionLabel={option => option.name}
                          getOptionValue={option => option.id}
                          placeholder="Select an account"
                        />

                        {errors.account && <div className="error-message">{errors.account}</div>}
                      </div>

                      <div className={`form-field${errors.contact ? ' has-error' : ''}`}>
                        <label htmlFor="contact">Contact</label>
                        <AsyncSelect
                          defaultOptions
                          name="contact"
                          value={values.contact}
                          styles={SELECT_STYLES}
                          onChange={this.handleContact}
                          loadOptions={this.searchContacts}
                          getOptionLabel={option => option.fullName}
                          getOptionValue={option => option.id}
                          placeholder="Select a contact"
                        />

                        {errors.contact && <div className="error-message">{errors.contact}</div>}
                      </div>

                      <React.Fragment>
                        {dealSuggestions.length > 0 && showSuggestions ? (
                          <div className="form-suggestions">
                            <div className="form-suggestion-title">
                              <div>{t('forms:deal.openDeal')}</div>

                              <button
                                className="hl-interface-btn"
                                onClick={this.handleClose}
                                type="button"
                              >
                                <i className="lilicon hl-close-icon" />
                              </button>
                            </div>

                            <div className="form-suggestion-items">
                              {dealSuggestions.map(suggestion => {
                                const navLink = (
                                  <Link to={`/deals/${suggestion.id}`}>{suggestion.name}</Link>
                                );

                                return (
                                  <div className="form-suggestion-row" key={suggestion.id}>
                                    <div className="form-suggestion-info">
                                      Check it out: {navLink}
                                    </div>

                                    <div className="form-suggestion-action">
                                      <button
                                        className="hl-primary-btn"
                                        onClick={() => this.editDeal(suggestion.id)}
                                        type="button"
                                      >
                                        Edit deal
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : null}
                      </React.Fragment>

                      <div className="form-field">
                        <label required>Business</label>
                        <RadioButtons
                          options={['New', 'Existing']}
                          setSelection={value => setFieldValue('newBusiness', value)}
                        />
                      </div>

                      <div className={`form-field${errors.foundThrough ? ' has-error' : ''}`}>
                        <label htmlFor="foundThrough" required>
                          Found us through
                        </label>
                        <Select
                          name="foundThrough"
                          value={values.foundThrough}
                          styles={SELECT_STYLES}
                          onChange={value => setFieldValue('foundThrough', value)}
                          options={foundThrough}
                          getOptionLabel={option => option.name}
                          getOptionValue={option => option.id}
                          placeholder="Select a channel"
                        />

                        {errors.foundThrough && (
                          <div className="error-message">{errors.foundThrough}</div>
                        )}
                      </div>

                      <div className={`form-field${errors.contactedBy ? ' has-error' : ''}`}>
                        <label htmlFor="type" required>
                          Contacted us by
                        </label>
                        <Select
                          name="contactedBy"
                          value={values.contactedBy}
                          styles={SELECT_STYLES}
                          onChange={value => setFieldValue('contactedBy', value)}
                          options={contactedBy}
                          getOptionLabel={option => option.name}
                          getOptionValue={option => option.id}
                          placeholder="Select a medium"
                        />

                        {errors.contactedBy && (
                          <div className="error-message">{errors.contactedBy}</div>
                        )}
                      </div>

                      <div className={`form-field${errors.whyCustomer ? ' has-error' : ''}`}>
                        <label htmlFor="type" required>
                          Why customer
                        </label>
                        <Select
                          name="whyCustomer"
                          value={values.whyCustomer}
                          styles={SELECT_STYLES}
                          onChange={value => setFieldValue('whyCustomer', value)}
                          options={whyCustomer}
                          getOptionLabel={option => option.name}
                          getOptionValue={option => option.id}
                          placeholder="Select a reason"
                        />

                        {errors.whyCustomer && (
                          <div className="error-message">{errors.whyCustomer}</div>
                        )}
                      </div>
                    </FormSection>

                    <FormSection header="What is it?">
                      <div className={`form-field${errors.name ? ' has-error' : ''}`}>
                        <label htmlFor="name" required>
                          Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          className="hl-input"
                          placeholder="Name"
                          value={values.name}
                          onChange={handleChange}
                          onBlur={this.searchName}
                        />

                        {errors.name && <div className="error-message">{errors.name}</div>}
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

                      <div className={`form-field${errors.currency ? ' has-error' : ''}`}>
                        <label htmlFor="currency" required>
                          Currency
                        </label>
                        <Select
                          name="currency"
                          value={values.currency}
                          styles={SELECT_STYLES}
                          onChange={value => setFieldValue('currency', value)}
                          options={currencies}
                          getOptionLabel={option => option.name}
                          getOptionValue={option => option.code}
                          placeholder="Select a currency"
                        />

                        {errors.currency && <div className="error-message">{errors.currency}</div>}
                      </div>

                      <div className={`form-field${errors.amountOnce ? ' has-error' : ''}`}>
                        <label htmlFor="amountOnce" required>
                          One-time cost
                        </label>
                        <input
                          id="amountOnce"
                          type="text"
                          className="hl-input"
                          placeholder="One-time cost"
                          value={values.amountOnce}
                          onChange={handleChange}
                        />

                        {errors.amountOnce && (
                          <div className="error-message">{errors.amountOnce}</div>
                        )}
                      </div>

                      <div className={`form-field${errors.amountRecurring ? ' has-error' : ''}`}>
                        <label htmlFor="amountRecurring" required>
                          Recurring costs
                        </label>
                        <input
                          id="amountRecurring"
                          type="text"
                          className="hl-input"
                          placeholder="Recurring costs"
                          value={values.amountRecurring}
                          onChange={handleChange}
                        />

                        {errors.amountRecurring && (
                          <div className="error-message">{errors.amountRecurring}</div>
                        )}
                      </div>

                      <div className={`form-field${errors.quoteId ? ' has-error' : ''}`}>
                        <label htmlFor="name">Freedom quote ID</label>
                        <input
                          id="quoteId"
                          type="text"
                          className="hl-input"
                          placeholder="Freedom quote ID"
                          value={values.quoteId}
                          onChange={handleChange}
                        />

                        {errors.quoteId && <div className="error-message">{errors.quoteId}</div>}
                      </div>
                    </FormSection>

                    <FormSection header="What's the status?">
                      <div className={`form-field${errors.status ? ' has-error' : ''}`}>
                        <label htmlFor="status" required>
                          Status
                        </label>
                        <Select
                          name="status"
                          value={values.status}
                          styles={SELECT_STYLES}
                          onChange={this.handleStatus}
                          options={statuses}
                          getOptionLabel={option => option.name}
                          getOptionValue={option => option.id}
                          placeholder="Select a status"
                        />

                        {errors.status && <div className="error-message">{errors.status}</div>}
                      </div>

                      {values.status === this.lostStatus && (
                        <div className={`form-field${errors.whyLost ? ' has-error' : ''}`}>
                          <label htmlFor="whyLost" required>
                            Why lost
                          </label>
                          <Select
                            name="whyLost"
                            value={values.whyLost}
                            styles={SELECT_STYLES}
                            onChange={value => setFieldValue('whyLost', value)}
                            options={whyLost}
                            getOptionLabel={option => option.name}
                            getOptionValue={option => option.id}
                            placeholder="Select a reason"
                          />

                          {errors.whyLost && <div className="error-message">{errors.whyLost}</div>}
                        </div>
                      )}

                      <div className={`form-field${errors.nextStep ? ' has-error' : ''}`}>
                        <label htmlFor="nextStep" required>
                          Next step
                        </label>
                        <Select
                          name="nextStep"
                          value={values.nextStep}
                          styles={SELECT_STYLES}
                          onChange={this.handleNextStep}
                          options={nextSteps}
                          getOptionLabel={option => option.name}
                          getOptionValue={option => option.id}
                          components={{ SingleValue: this.IconValue, Option: this.IconOption }}
                          placeholder="Select a reason"
                        />

                        {errors.nextStep && <div className="error-message">{errors.nextStep}</div>}
                      </div>

                      <div className={`form-field${errors.nextStepDate ? ' has-error' : ''}`}>
                        <label htmlFor="nextStepDate">Next step date</label>

                        <LilyDatepicker
                          date={values.nextStepDate}
                          onChange={value => setFieldValue('nextStepDate', value)}
                          placeholder="Next step date"
                        />

                        {errors.nextStepDate && (
                          <div className="error-message">{errors.nextStepDate}</div>
                        )}
                      </div>
                    </FormSection>

                    <FormSection header="Who is going to do this?">
                      <div className={`form-field${errors.assignedToTeams ? ' has-error' : ''}`}>
                        <label htmlFor="assignedToTeams">Assigned to teams</label>
                        <AsyncSelect
                          isMulti
                          defaultOptions
                          name="assignedToTeams"
                          value={values.assignedToTeams}
                          styles={SELECT_STYLES}
                          onChange={value => setFieldValue('assignedToTeams', value)}
                          loadOptions={this.searchTeams}
                          getOptionLabel={option => option.name}
                          getOptionValue={option => option.id}
                        />

                        {errors.assignedToTeams && (
                          <div className="error-message">{errors.assignedToTeams}</div>
                        )}
                      </div>

                      <div className={`form-field${errors.assignedTo ? ' has-error' : ''}`}>
                        <label htmlFor="assignedTo">Assigned to</label>
                        <AsyncSelect
                          defaultOptions
                          name="assignedTo"
                          classNamePrefix="editable-input"
                          value={values.assignedTo}
                          styles={SELECT_STYLES}
                          onChange={this.handleAssignedTo}
                          loadOptions={this.searchUsers}
                          getOptionLabel={option => option.fullName}
                          getOptionValue={option => option.id}
                        />

                        {errors.assignedTo && (
                          <div className="error-message">{errors.assignedTo}</div>
                        )}
                      </div>
                    </FormSection>

                    <FormSection header="Tags">
                      <div className="form-field">
                        <label>Tags</label>
                        <TagField items={values.tags} handleRelated={this.handleRelated} />
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

const DealForm = withRouter(
  withFormik({
    mapPropsToValues: () => ({
      account: null,
      contact: null,
      newBusiness: 1,
      foundThrough: null,
      contactedBy: null,
      whyCustomer: null,
      whyLost: null,
      name: '',
      description: '',
      currency: 'EUR',
      amountOnce: 0,
      amountRecurring: 0,
      quoteId: '',
      status: null,
      nextStep: null,
      nextStepDate: format(new Date(), FORM_DATE_FORMAT),
      assignedToTeams: [],
      assignedTo: null,
      twitterChecked: 0,
      cardSent: 0,
      quoteChecked: 0,
      tags: []
    }),
    handleSubmit: (values, { props, setSubmitting, setErrors }) => {
      const { t } = props;
      const cleanedValues = Object.assign({}, values);

      // TODO: Create some util function to take care of this.
      if (cleanedValues.account) cleanedValues.account = cleanedValues.account.id;
      if (cleanedValues.contact) cleanedValues.contact = cleanedValues.contact.id;
      if (cleanedValues.foundThrough) cleanedValues.foundThrough = cleanedValues.foundThrough.id;
      if (cleanedValues.contactedBy) cleanedValues.contactedBy = cleanedValues.contactedBy.id;
      if (cleanedValues.whyCustomer) cleanedValues.whyCustomer = cleanedValues.whyCustomer.id;
      if (cleanedValues.whyLost) cleanedValues.whyLost = cleanedValues.whyLost.id;
      if (cleanedValues.status) cleanedValues.status = cleanedValues.status.id;
      if (cleanedValues.nextStep) cleanedValues.nextStep = cleanedValues.nextStep.id;
      if (cleanedValues.assignedTo) cleanedValues.assignedTo = cleanedValues.assignedTo.id;
      if (cleanedValues.assignedToTeams) {
        cleanedValues.assignedToTeams = cleanedValues.assignedToTeams.map(team => team.id);
      }
      if (cleanedValues.currency) cleanedValues.currency = cleanedValues.currency.code;

      if (cleanedValues.nextStepDate === '') {
        cleanedValues.nextStepDate = null;
      } else {
        cleanedValues.nextStepDate = format(cleanedValues.nextStepDate, API_DATE_FORMAT);
      }

      let request;
      let text;

      if (values.id) {
        request = Deal.patch(cleanedValues);
        text = t('toasts:modelUpdated', { model: 'deal' });
      } else {
        request = Deal.post(cleanedValues);
        text = t('toasts:modelCreated', { model: 'deal' });
      }

      request
        .then(response => {
          if (props.closeSidebar) {
            props.closeSidebar();
          }

          successToast(text);

          props.history.push(`/deals/${response.id}`);
        })
        .catch(errors => {
          errorToast(t('toasts:error'));
          setErrors(errors.data);
          setSubmitting(false);
        });
    },
    displayName: 'DealForm'
  })(InnerDealForm)
);

export default withNamespaces(['forms', 'toasts'])(withContext(DealForm));
