import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFormik } from 'formik';

import withContext from 'src/withContext';
import BlockUI from 'components/Utils/BlockUI';
import RadioButtons from 'components/RadioButtons';
import FormSection from 'components/Utils/FormSection';
import FormFooter from 'components/Utils/FormFooter';
import User from 'models/User';
import TemplateVariable from 'src/models/TemplateVariable';

class InnerTemplateVariableForm extends Component {
  componentDidMount() {
    const { id } = this.props.match.params;

    if (id) {
      const templateVariable = TemplateVariable.get(id);

      this.props.setValues(templateVariable);
    }
  }

  render() {
    const { values, errors, isSubmitting, handleChange, handleSubmit } = this.props;

    return (
      <BlockUI blocking={isSubmitting}>
        <div className="content-block-container">
          <div className="content-block">
            <div className="content-block-header">
              <div className="content-block-name">
                {values.id ? (
                  <React.Fragment>Edit template variable</React.Fragment>
                ) : (
                  <React.Fragment>Add template variable</React.Fragment>
                )}
              </div>
            </div>

            <div className="content-block-content">
              <form onSubmit={handleSubmit}>
                <FormSection>
                  <div className={`form-field${errors.name ? ' has-error' : ''}`}>
                    <label htmlFor="firstName" required>
                      Variable name
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="hl-input"
                      placeholder="Variable name"
                      value={values.name}
                      onChange={handleChange}
                    />

                    {errors.name && <div className="error-message">{errors.name}</div>}
                  </div>

                  <div className={`form-field${errors.text ? ' has-error' : ''}`}>
                    <label htmlFor="text" required>
                      Content
                    </label>
                    <textarea id="text" rows="3" value={values.text} onChange={handleChange} />

                    {errors.text && <div className="error-message">{errors.text}</div>}
                  </div>

                  <div className="form-field">
                    <label>Is public</label>
                    <RadioButtons
                      options={['No', 'Yes']}
                      setSelection={value => this.props.setFieldValue('isPublic', value)}
                    />
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

const TemplateVariableForm = withRouter(
  withFormik({
    mapPropsToValues: () => ({
      name: '',
      text: '',
      isPublic: false
    }),
    handleSubmit: (values, { setSubmitting, setErrors }) => {
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
    displayName: 'TemplateVariableForm'
  })(InnerTemplateVariableForm)
);

export default withContext(TemplateVariableForm);
