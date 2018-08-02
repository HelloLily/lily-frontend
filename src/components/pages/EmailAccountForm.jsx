import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router-dom';
import { withFormik } from 'formik';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import BlockUI from 'components/Utils/BlockUI';
import UserShare from 'components/UserShare';
import RadioButtons from 'components/RadioButtons';
import EmailAccount from 'models/EmailAccount';

class InnerEmailAccountForm extends Component {
  constructor(props) {
    super(props);

    this.privacyOptions = EmailAccount.privacyOptions();

    this.state = { shareAdditions: [] };
  }

  async componentDidMount() {
    const emailAccount = await EmailAccount.get(this.props.match.params.id);

    this.props.setValues(emailAccount);
  }

  handleAdditions = value => {
    this.setState({ shareAdditions: value });
  };

  addAdditions = () => {
    this.setState({ shareAdditions: [] });
  };

  render() {
    const { values, errors, dirty, isSubmitting, handleChange, handleSubmit } = this.props;
    const { shareAdditions } = this.state;

    return (
      <BlockUI blocking={isSubmitting}>
        <div className="content-block-container">
          <div className="content-block">
            <div className="content-block-header">
              <div className="content-block-name">{values.emailAddress}</div>
            </div>

            <div className="content-block-content">
              <form onSubmit={handleSubmit}>
                <div className={`form-field${errors.fromName ? ' has-error' : ''}`}>
                  <label htmlFor="fromName" required>
                    From name
                  </label>
                  <input
                    id="fromName"
                    type="text"
                    className="hl-input"
                    placeholder="From name"
                    value={values.fromName}
                    onChange={handleChange}
                  />

                  {errors.fromName && <div className="error-message">{errors.fromName}</div>}
                </div>

                <div className={`form-field${errors.label ? ' has-error' : ''}`}>
                  <label htmlFor="label" required>
                    Mailbox name
                  </label>
                  <input
                    id="label"
                    type="text"
                    className="hl-input"
                    placeholder="Label"
                    value={values.label}
                    onChange={handleChange}
                  />

                  {errors.label && <div className="error-message">{errors.label}</div>}
                </div>

                <div className={`form-field${errors.color ? ' has-error' : ''}`}>
                  <label htmlFor="color">Label color</label>

                  <div className="display-flex">
                    <input id="color" type="color" value={values.color} onChange={handleChange} />

                    <div className="account-label m-l-10" style={{ borderLeftColor: values.color }}>
                      {values.label}
                    </div>
                  </div>

                  {errors.color && <div className="error-message">{errors.color}</div>}
                </div>

                <div className={`form-field${errors.onlyNew ? ' has-error' : ''}`}>
                  <label htmlFor="onlyNew">Load all email into Lily?</label>

                  <RadioButtons
                    vertical
                    options={[
                      'Yes, load all email into Lily',
                      'No, only load email received from now on'
                    ]}
                    setSelection={value => this.props.setFieldValue('onlyNew', value)}
                  />

                  {errors.onlyNew && <div className="error-message">{errors.onlyNew}</div>}
                </div>

                <div className="m-b-20">
                  <div className="content-block-name">Share your email</div>

                  <Tabs>
                    <TabList>
                      <Tab>Basic</Tab>
                      <Tab>Advanced</Tab>

                      <a
                        href="https://intercom.help/lily/your-first-steps-with-lily/email-how-to-share"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="privacy-more-info"
                      >
                        More info
                      </a>
                    </TabList>

                    <TabPanel>
                      <p>This inbox is a:</p>
                      <div className="privacy-radios">
                        {this.privacyOptions.map(option => (
                          <div className="privacy-option-container" key={option.id}>
                            <input
                              id={`privacy_${option.id}`}
                              type="radio"
                              name="privacy"
                              value={option.id}
                              checked={option.id === values.privacy}
                              onChange={() => this.props.setFieldValue('privacy', option.id)}
                            />

                            <label htmlFor={`privacy_${option.id}`} className="privacy-option">
                              <div>
                                {option.name}
                                <div className="text-muted small">({option.text})</div>
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>

                      <h3 className="privacy-example-title">Example of timeline</h3>

                      <div className="privacy-examples">
                        {(values.privacy === EmailAccount.PUBLIC ||
                          values.privacy === EmailAccount.READONLY) && <div>Example public</div>}

                        {values.privacy === EmailAccount.METADATA && <div>Example metadata</div>}

                        {values.privacy === EmailAccount.PRIVATE && <div>Example private</div>}
                      </div>
                    </TabPanel>

                    <TabPanel>
                      <p>Give specific colleagues additional permissions to your email</p>

                      <UserShare
                        handleAdditions={this.handleAdditions}
                        addAdditions={this.addAdditions}
                        emailAccount={values}
                        shareAdditions={shareAdditions}
                      />
                    </TabPanel>
                  </Tabs>
                </div>

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

const EmailAccountForm = withRouter(
  withFormik({
    mapPropsToValues: () => ({
      fromName: '',
      label: '',
      color: '',
      privacy: EmailAccount.READONLY
    }),
    // validationSchema: Yup.object().shape({
    //   email: Yup.string()
    //     .email('Invalid email address')
    //     .required('Email is required!'),
    // }),
    handleSubmit: (values, { props, setSubmitting, setErrors }) => {
      const request = EmailAccount.patch(values);

      request
        .then(() => {
          props.history.push('/preferences/emailaccounts');
        })
        .catch(errors => {
          setErrors(errors.data);
          setSubmitting(false);
        });
    },
    displayName: 'EmailAccountForm'
  })(InnerEmailAccountForm)
);

export default EmailAccountForm;
