import React, { Component } from 'react';
import { withFormik } from 'formik';
import { withNamespaces } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import withContext from 'src/withContext';
import { successToast, errorToast } from 'utils/toasts';
import handleKeydown from 'utils/handleKeydown';
import BlockUI from 'components/Utils/BlockUI';
import FormSection from 'components/Utils/FormSection';
import FormFooter from 'components/Utils/FormFooter';
import User from 'models/User';

const WEBHOOK_EMPTY_ROW = { url: '', name: '' };

class InnerWebhookForm extends Component {
  constructor(props) {
    super(props);

    document.title = 'My webhooks - Lily';
  }

  componentDidMount() {
    const { currentUser } = this.props;

    if (currentUser.webhooks.length > 0) {
      const data = {
        webhooks: currentUser.webhooks
      };

      this.props.setValues(data);
    }
  }

  handleChange = (value, index, field) => {
    const items = this.props.values.webhooks;
    items[index][field] = value;

    this.props.setFieldValue('webhooks', items);
  };

  toggleDelete = index => {
    const items = this.props.values.webhooks;
    items[index].isDeleted = !items[index].isDeleted;

    this.props.setFieldValue('webhooks', items);
  };

  render() {
    const { values, errors, isSubmitting, handleSubmit, t } = this.props;

    return (
      <BlockUI blocking={isSubmitting}>
        <div className="content-block-container">
          <div className="content-block">
            <div className="content-block-header">
              <div className="content-block-name">My webhook</div>
            </div>

            <div className="content-block-content">
              <p>{t('preferences:user.webhookIntro')}</p>

              <form onKeyDown={event => handleKeydown(event, handleSubmit)}>
                <FormSection header="Webhook info">
                  {values.webhooks.map((webhook, index) => {
                    const key = `webhook-${index}`;
                    const { isDeleted } = webhook;

                    return (
                      <React.Fragment key={key}>
                        <div className={`form-field${isDeleted ? ' is-deleted' : ''}`}>
                          <label htmlFor="url" required>
                            Webhook URL & name
                          </label>

                          <div className="display-flex">
                            <input
                              id="url"
                              type="text"
                              className="hl-input"
                              placeholder="www.example.com"
                              value={webhook.url}
                              onChange={event =>
                                this.handleChange(event.target.value, index, 'url')
                              }
                            />

                            <input
                              id="name"
                              type="text"
                              className="hl-input"
                              placeholder="Webhook name"
                              value={webhook.name}
                              onChange={event =>
                                this.handleChange(event.target.value, index, 'name')
                              }
                            />

                            <div className="form-related-actions">
                              <button
                                className="hl-primary-btn"
                                type="button"
                                onClick={() => this.toggleDelete(index)}
                              >
                                {webhook.isDeleted ? (
                                  <FontAwesomeIcon icon="undo" />
                                ) : (
                                  <i className="lilicon hl-trashcan-icon" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
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

const WebhookForm = withFormik({
  mapPropsToValues: () => ({
    webhooks: [WEBHOOK_EMPTY_ROW]
  }),
  handleSubmit: (values, { props, setFieldValue, setSubmitting, setErrors }) => {
    const { t, currentUser } = props;

    const data = {
      id: currentUser.id,
      webhooks: values.webhooks
    };

    User.patch(data)
      .then(response => {
        successToast(t('toasts:webhooksUpdated'));
        setSubmitting(false);

        if (response.webhooks.length === 0) {
          setFieldValue('webhooks', [WEBHOOK_EMPTY_ROW]);
        }
      })
      .catch(errors => {
        errorToast(t('toasts:error'));
        setErrors(errors.data);
        setSubmitting(false);
      });
  },
  displayName: 'WebhookForm'
})(InnerWebhookForm);

export default withNamespaces(['preferences', 'toasts'])(withContext(WebhookForm));
