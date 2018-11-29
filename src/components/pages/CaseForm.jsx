import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withFormik } from 'formik';
import { withNamespaces } from 'react-i18next';
import { format } from 'date-fns';
import Select from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
import Textarea from 'react-textarea-autosize';
import { debounce } from 'debounce';

import withContext from 'src/withContext';
import { SELECT_STYLES, FORM_DATE_FORMAT, API_DATE_FORMAT, DEBOUNCE_WAIT } from 'lib/constants';
import { successToast, errorToast } from 'utils/toasts';
import addBusinessDays from 'utils/addBusinessDays';
import BlockUI from 'components/Utils/BlockUI';
import Form from 'components/Form';
import FormSection from 'components/Form/FormSection';
import FormFooter from 'components/Form/FormFooter';
import { NoAccountsMessage, NoContactsMessage } from 'components/Form/NoOptionsMessages';
import LilyDatepicker from 'components/Utils/LilyDatePicker';
import LoadingIndicator from 'components/Utils/LoadingIndicator';
import TagField from 'components/Fields/TagField';
import Account from 'models/Account';
import Contact from 'models/Contact';
import User from 'models/User';
import UserTeam from 'models/UserTeam';
import Case from 'models/Case';

class InnerCaseForm extends Component {
  constructor(props) {
    super(props);

    this.mounted = false;
    this.originalDate = props.values.id ? new Date(props.values.expires) : new Date();

    this.state = {
      caseTypes: [],
      caseStatuses: [],
      casePriorities: [],
      caseSuggestions: [],
      showSuggestions: true,
      loading: true
    };
  }

  async componentDidMount() {
    this.mounted = true;

    const { currentUser, data, setFieldValue } = this.props;

    let title;
    const typeData = await Case.caseTypes();
    const statusData = await Case.statuses();
    const priorityData = await Case.priorities();

    const { id } = this.props.match.params;

    if (id) {
      await this.loadCase(id);

      title = `${this.props.values.subject} - Lily`;
    } else {
      setFieldValue('assignedToTeams', currentUser.teams);
      setFieldValue('assignedTo', currentUser);
      setFieldValue('status', statusData.results[0]);

      if (data) {
        setFieldValue('description', data.emailMessageLink);

        if (data.account) {
          setFieldValue('account', data.account);
        }

        Object.keys(data).forEach(key => {
          setFieldValue(key, data[key]);
        });
      }

      title = 'Add case - Lily';
    }

    if (!this.props.sidebar) {
      document.title = title;
    }

    if (this.mounted) {
      this.setState({
        caseTypes: typeData.results,
        caseStatuses: statusData.results,
        casePriorities: priorityData.results,
        loading: false
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  loadCase = async id => {
    const caseResponse = await Case.get(id);

    if (caseResponse.account && caseResponse.account.isDeleted) {
      caseResponse.account = null;
    }

    if (caseResponse.contact && caseResponse.contact.isDeleted) {
      caseResponse.contact = null;
    }

    this.props.setValues(caseResponse);
  };

  editCase = async id => {
    await this.loadCase(id);

    this.props.history.push(`/cases/${id}/edit`);

    // Clear the suggestions.
    this.setState({ caseSuggestions: [] });
  };

  searchName = async () => {
    const { contactSuggestions, showSuggestions } = this.state;
    const { subject } = this.props.values;

    if (!this.props.values.id && subject) {
      const response = await Case.query({ search: subject });

      if (response.hits.length > 0) {
        contactSuggestions.name = response.hits;
      }

      showSuggestions.name = true;

      this.setState({ contactSuggestions, showSuggestions });
    }
  };

  searchAccounts = async query => {
    const request = await Account.query({ search: query, ordering: 'name' });

    return request.results;
  };

  searchContacts = async query => {
    const request = await Contact.query({ search: query, ordering: 'firstName' });

    return request.results;
  };

  searchTeams = async query => {
    const request = await UserTeam.query({ search: query, ordering: 'name' });

    return request.results;
  };

  searchUsers = async query => {
    const request = await User.query({ search: query, ordering: 'firstName' });

    return request.results;
  };

  handlePriority = priority => {
    const newDate = addBusinessDays(priority.dateIncrement, this.originalDate);
    const formattedDate = format(newDate, FORM_DATE_FORMAT);

    this.props.setFieldValue('expires', formattedDate);
    this.props.setFieldValue('priority', priority.id);
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

    const caseResponse = await Case.openCases(args);

    this.setState({ caseSuggestions: caseResponse.results, showSuggestions: true });
  };

  handleContact = value => {
    this.props.setFieldValue('contact', value);
  };

  render() {
    const {
      caseTypes,
      caseStatuses,
      casePriorities,
      loading,
      caseSuggestions,
      showSuggestions
    } = this.state;
    const {
      values,
      errors,
      isSubmitting,
      handleChange,
      handleSubmit,
      setFieldValue,
      currentUser,
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
                      <React.Fragment>Edit case</React.Fragment>
                    ) : (
                      <React.Fragment>Add case</React.Fragment>
                    )}
                  </div>
                </div>

                <div className="content-block-content">
                  <Form handleSubmit={handleSubmit}>
                    <FormSection header="Who was it?">
                      <div className={`form-field${errors.account ? ' has-error' : ''}`}>
                        <label htmlFor="account">Account</label>
                        <AsyncSelect
                          defaultOptions
                          name="account"
                          value={values.account}
                          styles={SELECT_STYLES}
                          onChange={this.handleAccount}
                          loadOptions={debounce(this.searchAccounts, DEBOUNCE_WAIT)}
                          getOptionLabel={option => option.name}
                          getOptionValue={option => option.id}
                          placeholder="Select an account"
                          components={{ NoOptionsMessage: NoAccountsMessage }}
                          callback={account => setFieldValue('account', account)}
                          currentUser={currentUser}
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
                          loadOptions={debounce(this.searchContacts, DEBOUNCE_WAIT)}
                          getOptionLabel={option => option.fullName}
                          getOptionValue={option => option.id}
                          placeholder="Select a contact"
                          components={{ NoOptionsMessage: NoContactsMessage }}
                          callback={contact => setFieldValue('contact', contact)}
                          currentUser={currentUser}
                          account={values.account}
                        />

                        {errors.contact && <div className="error-message">{errors.contact}</div>}
                      </div>

                      <React.Fragment>
                        {caseSuggestions.length > 0 && showSuggestions ? (
                          <div className="form-suggestions">
                            <div className="form-suggestion-title">
                              <div>{t('forms:case.openCase')}</div>

                              <button
                                className="hl-interface-btn"
                                onClick={this.handleClose}
                                type="button"
                              >
                                <i className="lilicon hl-close-icon" />
                              </button>
                            </div>

                            <div className="form-suggestion-items">
                              {caseSuggestions.map(suggestion => {
                                const navLink = (
                                  <Link to={`/cases/${suggestion.id}`}>{suggestion.subject}</Link>
                                );

                                return (
                                  <div className="form-suggestion-row" key={suggestion.id}>
                                    <div className="form-suggestion-info">
                                      Check it out: {navLink}
                                    </div>

                                    <div className="form-suggestion-action">
                                      <button
                                        className="hl-primary-btn"
                                        onClick={() => this.editCase(suggestion.id)}
                                        type="button"
                                      >
                                        Edit case
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : null}
                      </React.Fragment>
                    </FormSection>

                    <FormSection header="What to do?">
                      <div className={`form-field${errors.subject ? ' has-error' : ''}`}>
                        <label htmlFor="subject" required>
                          Subject
                        </label>
                        <input
                          id="subject"
                          type="text"
                          className="hl-input"
                          placeholder="Subject"
                          value={values.subject}
                          onChange={handleChange}
                          onBlur={this.searchName}
                        />

                        {errors.subject && <div className="error-message">{errors.subject}</div>}
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

                      <div className={`form-field${errors.type ? ' has-error' : ''}`}>
                        <label htmlFor="type" required>
                          Type
                        </label>
                        <Select
                          name="type"
                          value={values.type}
                          styles={SELECT_STYLES}
                          onChange={value => setFieldValue('type', value)}
                          options={caseTypes}
                          getOptionLabel={option => option.name}
                          getOptionValue={option => option.id}
                          placeholder="Select a type"
                        />

                        {errors.type && <div className="error-message">{errors.type}</div>}
                      </div>

                      <div className={`form-field${errors.status ? ' has-error' : ''}`}>
                        <label htmlFor="status" required>
                          Status
                        </label>
                        <Select
                          name="status"
                          classNamePrefix="editable-input"
                          value={values.status}
                          styles={SELECT_STYLES}
                          onChange={value => setFieldValue('status', value)}
                          options={caseStatuses}
                          getOptionLabel={option => option.name}
                          getOptionValue={option => option.id}
                        />

                        {errors.status && <div className="error-message">{errors.status}</div>}
                      </div>
                    </FormSection>

                    <FormSection header="When to do it?">
                      <div className="form-field">
                        <label htmlFor="priority" required>
                          Priority
                        </label>

                        <div className="case-priority-buttons">
                          {casePriorities.map(priority => {
                            let dateIncrementText = '';

                            if (priority.dateIncrement > 1) {
                              dateIncrementText = `(in ${priority.dateIncrement} days)`;
                            } else if (priority.dateIncrement === 1) {
                              dateIncrementText = '(tomorrow)';
                            } else {
                              dateIncrementText = '(today)';
                            }

                            const isSelected = values.priority === priority.id;

                            return (
                              <button
                                key={priority.id}
                                className={`hl-primary-btn ${priority.name.toLowerCase()}-priority`}
                                onClick={() => this.handlePriority(priority)}
                                type="button"
                              >
                                <label
                                  className={`radio-button${
                                    isSelected ? ' active' : ''
                                  } m-l-5 display-inline-block`}
                                >
                                  <input
                                    readOnly
                                    type="radio"
                                    id={`priority-${priority.id}`}
                                    className="radio-button-input"
                                    checked={isSelected}
                                  />

                                  <span className="radio-button-label">
                                    {isSelected && <span className="radio-button-checkmark" />}

                                    {priority.name}
                                  </span>
                                </label>
                                <span className="text-muted small"> {dateIncrementText}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className={`form-field${errors.expires ? ' has-error' : ''}`}>
                        <label htmlFor="expires" required>
                          Expiry date
                        </label>
                        <LilyDatepicker
                          date={values.expires}
                          onChange={value => setFieldValue('expires', value)}
                          placeholder="Expiry date"
                        />

                        {errors.expires && <div className="error-message">{errors.expires}</div>}
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
                          loadOptions={debounce(this.searchTeams, DEBOUNCE_WAIT)}
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
                          onChange={value => setFieldValue('assignedTo', value)}
                          loadOptions={debounce(this.searchUsers, DEBOUNCE_WAIT)}
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

const CaseForm = withRouter(
  withFormik({
    mapPropsToValues: () => ({
      account: null,
      contact: null,
      subject: '',
      description: '',
      type: null,
      status: null,
      priority: 0,
      expires: format(new Date(), FORM_DATE_FORMAT),
      tags: []
    }),
    handleSubmit: (values, { props, setSubmitting, setErrors }) => {
      const { t } = props;
      const cleanedValues = Object.assign({}, values);

      if (cleanedValues.account) cleanedValues.account = cleanedValues.account.id;
      if (cleanedValues.contact) cleanedValues.contact = cleanedValues.contact.id;
      if (cleanedValues.type) cleanedValues.type = cleanedValues.type.id;
      if (cleanedValues.status) cleanedValues.status = cleanedValues.status.id;
      if (cleanedValues.assignedTo) cleanedValues.assignedTo = cleanedValues.assignedTo.id;
      if (cleanedValues.assignedToTeams) {
        cleanedValues.assignedToTeams = cleanedValues.assignedToTeams.map(team => team.id);
      }

      cleanedValues.expires = format(cleanedValues.expires, API_DATE_FORMAT);

      let request;
      let text;

      if (values.id) {
        request = Case.patch(cleanedValues);
        text = t('toasts:modelUpdated', { model: 'case' });
      } else {
        request = Case.post(cleanedValues);
        text = t('toasts:modelCreated', { model: 'case' });
      }

      request
        .then(response => {
          successToast(text);

          if (!values.id) window.Intercom('trackEvent', 'case-created');

          if (props.closeSidebar) {
            props.closeSidebar();
          } else {
            props.history.push(`/cases/${response.id}`);
          }
        })
        .catch(errors => {
          errorToast(t('toasts:error'));
          setErrors(errors.data);
          setSubmitting(false);
        });
    },
    displayName: 'CaseForm'
  })(InnerCaseForm)
);

export default withNamespaces(['forms', 'toasts'])(withContext(CaseForm));
