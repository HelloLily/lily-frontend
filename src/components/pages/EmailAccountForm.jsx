import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFormik } from 'formik';
import { withNamespaces } from 'react-i18next';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import withContext from 'src/withContext';
import { successToast, errorToast } from 'utils/toasts';
import getColorCode from 'utils/getColorCode';
import BlockUI from 'components/Utils/BlockUI';
import Form from 'components/Form';
import FormFooter from 'components/Form/FormFooter';
import UserShare from 'components/UserShare';
import RadioButtons from 'components/RadioButtons';
import EmailAccount from 'models/EmailAccount';

class InnerEmailAccountForm extends Component {
  constructor(props) {
    super(props);

    this.privacyOptions = EmailAccount.privacyOptions();
  }

  async componentDidMount() {
    const { currentUser } = this.props;
    const emailAccount = await EmailAccount.get(this.props.match.params.id);

    if (!emailAccount.color) {
      emailAccount.color = getColorCode(emailAccount.emailAddress);
    }

    emailAccount.sharedEmailConfigs = emailAccount.sharedEmailConfigs.filter(
      // Filter out the user's own configuration.
      config => config.user !== currentUser.id
    );

    this.props.setValues(emailAccount);

    document.title = 'Email account - Lily';
  }

  updateEmailAccount = emailAccount => {
    this.props.setValues(emailAccount);
  };

  render() {
    const { values, errors, isSubmitting, handleChange, handleSubmit, t } = this.props;

    return (
      <BlockUI blocking={isSubmitting}>
        <div className="content-block-container">
          <div className="content-block">
            <div className="content-block-header">
              <div className="content-block-name">{values.emailAddress}</div>
            </div>

            <div className="content-block-content">
              <Form handleSubmit={handleSubmit}>
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
                      {values.label || values.emailAddress}
                    </div>
                  </div>

                  {errors.color && <div className="error-message">{errors.color}</div>}
                </div>

                <div className={`form-field${errors.onlyNew ? ' has-error' : ''}`}>
                  <label htmlFor="onlyNew">{t('forms:emailAccount.loadAllMail')}</label>

                  <RadioButtons
                    vertical
                    options={[
                      t('forms:emailAccount.loadAllMailYes'),
                      t('forms:emailAccount.loadAllMailNo')
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
                      <p>{t('forms:emailAccount.advancedInfo')}</p>

                      <UserShare
                        updateEmailAccount={this.updateEmailAccount}
                        emailAccount={values}
                      />
                    </TabPanel>
                  </Tabs>
                </div>

                <FormFooter {...this.props} />
              </Form>
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
      privacy: EmailAccount.PUBLIC
    }),
    handleSubmit: (values, { props, setSubmitting, setErrors }) => {
      const { t } = props;

      const sharedEmailConfigs = values.sharedEmailConfigs.map(config => {
        config.user = config.user.id || config.user;

        return config;
      });
      const cleanedValues = {
        id: values.id,
        fromName: values.fromName,
        label: values.label,
        color: values.color,
        privacy: values.privacy,
        sharedEmailConfigs
      };
      const request = EmailAccount.patch(cleanedValues);
      const text = t('toasts:modelUpdated', { model: 'email account' });

      request
        .then(() => {
          successToast(text);

          props.history.push('/preferences/emailaccounts');
        })
        .catch(errors => {
          errorToast(t('toasts:error'));
          setErrors(errors.data);
          setSubmitting(false);
        });
    },
    displayName: 'EmailAccountForm'
  })(InnerEmailAccountForm)
);

export default withNamespaces(['forms', 'toasts'])(withContext(EmailAccountForm));
