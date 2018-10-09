import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFormik } from 'formik';
import { withNamespaces } from 'react-i18next';

import withContext from 'src/withContext';
import { successToast, errorToast } from 'utils/toasts';
import BlockUI from 'components/Utils/BlockUI';
import RadioButtons from 'components/RadioButtons';
import FormSection from 'components/Utils/FormSection';
import FormFooter from 'components/Utils/FormFooter';
import TemplateVariable from 'models/TemplateVariable';

class InnerTemplateVariableForm extends Component {
  componentDidMount() {
    const { id } = this.props.match.params;

    if (id) {
      const templateVariable = TemplateVariable.get(id);

      this.props.setValues(templateVariable);

      document.title = `${templateVariable.name} - Lily`;
    } else {
      document.title = 'Add template variable - Lily';
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
    handleSubmit: (values, { props, setSubmitting, setErrors }) => {
      const { t } = props;
      let request;
      let text;

      if (values.id) {
        request = TemplateVariable.patch(values);
        text = t('modelUpdated', { model: 'template variable' });
      } else {
        request = TemplateVariable.post(values);
        text = t('modelCreated', { model: 'template variable' });
      }

      request
        .then(() => {
          successToast(text);
          window.location.reload();
        })
        .catch(errors => {
          errorToast(text);
          setErrors(errors.data);
          setSubmitting(false);
        });
    },
    displayName: 'TemplateVariableForm'
  })(InnerTemplateVariableForm)
);

export default withNamespaces('toasts')(withContext(TemplateVariableForm));
