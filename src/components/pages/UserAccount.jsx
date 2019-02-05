import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFormik } from 'formik';
import { withNamespaces } from 'react-i18next';

import withContext from 'src/withContext';
import { successToast, errorToast } from 'utils/toasts';
import BlockUI from 'components/Utils/BlockUI';
import Form from 'components/Form';
import FormSection from 'components/Form/FormSection';
import FormFooter from 'components/Form/FormFooter';
import User from 'models/User';

class InnerUserAccountForm extends Component {
  componentDidMount() {
    const data = {
      id: this.props.currentUser.id,
      email: this.props.currentUser.email,
      password: '',
      passwordCheck: '',
      passwordConfirmation: ''
    };
    // Setting a single value with setFieldValue currently doesn't work in Formik.
    // To fix errors just set all values.
    this.props.setValues(data);

    document.title = 'My account - Lily';
  }

  render() {
    const { values, errors, isSubmitting, handleChange, handleSubmit } = this.props;

    return (
      <BlockUI blocking={isSubmitting}>
        <div className="content-block-container">
          <div className="content-block">
            <div className="content-block-header">
              <div className="content-block-name">My account</div>
            </div>

            <div className="content-block-content">
              <Form handleSubmit={handleSubmit}>
                <FormSection header="Email address">
                  <div className={`form-field${errors.email ? ' has-error' : ''}`}>
                    <label htmlFor="email">Email address</label>
                    <input
                      id="email"
                      type="text"
                      className="hl-input"
                      placeholder="Email address"
                      value={values.email}
                      onChange={handleChange}
                    />

                    {errors.email && <div className="error-message">{errors.email}</div>}
                  </div>
                </FormSection>

                <FormSection header="Change your password">
                  <div className={`form-field${errors.password ? ' has-error' : ''}`}>
                    <label htmlFor="password">New password</label>
                    <input
                      id="password"
                      type="password"
                      className="hl-input"
                      placeholder="New password"
                      value={values.password}
                      onChange={handleChange}
                    />

                    {errors.password && <div className="error-message">{errors.password}</div>}
                  </div>

                  <div className={`form-field${errors.passwordCheck ? ' has-error' : ''}`}>
                    <label htmlFor="passwordCheck">Confirm new password</label>
                    <input
                      id="passwordCheck"
                      type="password"
                      className="hl-input"
                      placeholder="Confirm password"
                      value={values.passwordCheck}
                      onChange={handleChange}
                    />

                    {errors.passwordCheck && (
                      <div className="error-message">{errors.passwordCheck}</div>
                    )}
                  </div>
                </FormSection>

                <FormSection header="Current password">
                  <div className={`form-field${errors.passwordConfirmation ? ' has-error' : ''}`}>
                    <label htmlFor="passwordConfirmation" required>
                      Current password
                    </label>
                    <input
                      id="passwordConfirmation"
                      type="password"
                      className="hl-input"
                      placeholder="Current password"
                      value={values.passwordConfirmation}
                      onChange={handleChange}
                    />

                    {errors.passwordConfirmation && (
                      <div className="error-message">{errors.passwordConfirmation}</div>
                    )}
                  </div>
                </FormSection>

                <FormFooter {...this.props} />
              </Form>
            </div>
          </div>
        </div>
      </BlockUI>
    );
  }
}

const UserAccountForm = withRouter(
  withFormik({
    mapPropsToValues: () => ({
      email: '',
      password: '',
      passwordCheck: '',
      passwordConfirmation: ''
    }),
    handleSubmit: (values, { props, setSubmitting, setErrors }) => {
      const { t } = props;
      const request = User.patch(values);

      request
        .then(() => {
          successToast(t('accountUpdated'));
          window.location.reload();
        })
        .catch(errors => {
          errorToast(t('error'));
          setErrors(errors.data);
          setSubmitting(false);
        });
    },
    displayName: 'UserAccountForm'
  })(InnerUserAccountForm)
);

export default withNamespaces('toasts')(withContext(UserAccountForm));
