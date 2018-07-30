import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router-dom';
import { withFormik } from 'formik';

import BlockUI from 'components/Utils/BlockUI';
import FormSection from 'components/Utils/FormSection';
import User from 'models/User';

class InnerUserAccountForm extends Component {
  async componentDidMount() {
    const user = await User.me();

    this.props.setValues(user);
  }

  render() {
    const { values, errors, dirty, isSubmitting, handleChange, handleSubmit } = this.props;

    return (
      <BlockUI blocking={isSubmitting}>
        <div className="content-block-container">
          <div className="content-block">
            <div className="content-block-header">
              <div className="content-block-name">My account</div>
            </div>

            <div className="content-block-content">
              <form onSubmit={handleSubmit}>
                <FormSection header="Email address">
                  <div className={`form-field${errors.email ? ' has-error' : ''}`}>
                    <label htmlFor="email">Email address</label>
                    <input
                      id="email"
                      placeholder="Email address"
                      type="text"
                      value={values.email}
                      onChange={handleChange}
                    />

                    {errors.email && <div className="error-message">{errors.email}</div>}
                  </div>
                </FormSection>

                <FormSection header="Current password">
                  <div className={`form-field${errors.password ? ' has-error' : ''}`}>
                    <label htmlFor="password">New password</label>
                    <input
                      id="password"
                      placeholder="New password"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                    />

                    {errors.password && <div className="error-message">{errors.password}</div>}
                  </div>

                  <div className={`form-field${errors.passwordCheck ? ' has-error' : ''}`}>
                    <label htmlFor="passwordCheck">Confirm new password</label>
                    <input
                      id="passwordCheck"
                      placeholder="Confirm password"
                      type="password"
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
                      placeholder="Current password"
                      type="password"
                      value={values.passwordConfirmation}
                      onChange={handleChange}
                    />

                    {errors.passwordConfirmation && (
                      <div className="error-message">{errors.passwordConfirmation}</div>
                    )}
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

const UserAccountForm = withRouter(
  withFormik({
    mapPropsToValues: () => ({
      email: '',
      passWord: '',
      passwordCheck: '',
      passwordConfirmation: ''
    }),
    // validationSchema: Yup.object().shape({
    //   email: Yup.string()
    //     .email('Invalid email address')
    //     .required('Email is required!'),
    // }),
    handleSubmit: (values, { props, setSubmitting, setErrors }) => {
      const request = User.patch(values);

      request
        .then(response => {
          // props.history.push(`/accounts/${response.id}`);
        })
        .catch(errors => {
          setErrors(errors.data);
          setSubmitting(false);
        });
    },
    displayName: 'ProfileForm'
  })(InnerUserAccountForm)
);

export default UserAccountForm;
