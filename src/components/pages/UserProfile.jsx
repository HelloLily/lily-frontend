import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFormik } from 'formik';

import withContext from 'src/withContext';
import formatPhoneNumber from 'utils/formatPhoneNumber';
import BlockUI from 'components/Utils/BlockUI';
import FormSection from 'components/Utils/FormSection';
import FormFooter from 'components/Utils/FormFooter';
import User from 'models/User';

class InnerProfileForm extends Component {
  componentDidMount() {
    const data = { ...this.props.currentUser };
    // TODO: This fixes the uncontrolled input error, change to proper value later.
    data.picture = '';

    this.props.setValues(data);

    document.title = 'My profile - Lily';
  }

  formatPhoneNumber = () => {
    const { values, currentUser } = this.props;
    const { formatted } = formatPhoneNumber(values.phoneNumber, currentUser);

    this.props.setFieldValue('phoneNumber', formatted);
  };

  render() {
    const { values, errors, isSubmitting, handleChange, handleSubmit } = this.props;

    return (
      <BlockUI blocking={isSubmitting}>
        <div className="content-block-container">
          <div className="content-block">
            <div className="content-block-header">
              <div className="content-block-name">My profile</div>
            </div>

            <div className="content-block-content">
              <form onSubmit={handleSubmit}>
                <FormSection header="Personal information">
                  <div className={`form-field${errors.firstName ? ' has-error' : ''}`}>
                    <label htmlFor="firstName" required>
                      First name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      className="hl-input"
                      placeholder="First name"
                      value={values.firstName}
                      onChange={handleChange}
                    />

                    {errors.firstName && <div className="error-message">{errors.firstName}</div>}
                  </div>

                  <div className={`form-field${errors.lastName ? ' has-error' : ''}`}>
                    <label htmlFor="lastName" required>
                      Last name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      className="hl-input"
                      placeholder="Last name"
                      value={values.lastName}
                      onChange={handleChange}
                    />

                    {errors.lastName && <div className="error-message">{errors.lastName}</div>}
                  </div>

                  <div className={`form-field${errors.position ? ' has-error' : ''}`}>
                    <label htmlFor="position">Position</label>
                    <input
                      id="position"
                      type="text"
                      className="hl-input"
                      placeholder="Position"
                      value={values.position}
                      onChange={handleChange}
                    />

                    {errors.position && <div className="error-message">{errors.position}</div>}
                  </div>

                  <div className={`form-field${errors.picture ? ' has-error' : ''}`}>
                    <label htmlFor="picture">Picture</label>

                    {values.picture && <img src={values.picture} alt="User avatar" />}

                    <input
                      id="picture"
                      type="file"
                      value={values.picture}
                      onChange={handleChange}
                    />

                    {errors.picture && <div className="error-message">{errors.picture}</div>}

                    <p className="text-muted small m-t-10">Maximum picture size is 300kb.</p>
                  </div>
                </FormSection>

                <FormSection header="Contact information">
                  <div className={`form-field${errors.phoneNumber ? ' has-error' : ''}`}>
                    <label htmlFor="phoneNumber" required>
                      Phone number
                    </label>
                    <input
                      id="phoneNumber"
                      type="text"
                      className="hl-input"
                      placeholder="Phone number"
                      value={values.phoneNumber}
                      onBlur={this.formatPhoneNumber}
                      onChange={handleChange}
                    />

                    {errors.phoneNumber && (
                      <div className="error-message">{errors.phoneNumber}</div>
                    )}
                  </div>

                  <div className={`form-field${errors.internalNumber ? ' has-error' : ''}`}>
                    <label htmlFor="internalNumber" required>
                      Internal number
                    </label>
                    <input
                      id="internalNumber"
                      type="text"
                      className="hl-input"
                      placeholder="Internal number"
                      value={values.internalNumber}
                      onChange={handleChange}
                    />

                    {errors.internalNumber && (
                      <div className="error-message">{errors.internalNumber}</div>
                    )}
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

const ProfileForm = withRouter(
  withFormik({
    mapPropsToValues: () => ({
      firstName: '',
      lastName: '',
      position: '',
      picture: '',
      phoneNumber: '',
      internalNumber: ''
    }),
    handleSubmit: (values, { setSubmitting, setErrors }) => {
      // Show message if notifications are supported by the browser,
      // but haven't been accepted/declined.
      if (
        'Notification' in window &&
        Notification.permission !== 'granted' &&
        Notification.permission !== 'denied'
      ) {
        // TODO: Temporary.
        alert(
          'For our call integration, we need your browsers permission to send you notifications. Please allow these notifications to make complete use of our call integration.'
        );
        Notification.requestPermission(() => {
          console.log('Accepted');
        });
      } else {
        // Otherwise just save the data.
      }

      const request = User.patch(values);

      request
        .then(() => {
          window.location.reload();
        })
        .catch(errors => {
          setErrors(errors.data);
          setSubmitting(false);
        });
    },
    displayName: 'ProfileForm'
  })(InnerProfileForm)
);

export default withContext(ProfileForm);
