import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFormik } from 'formik';
import { withNamespaces } from 'react-i18next';
import Select from 'react-select';

import withContext from 'src/withContext';
import { SELECT_STYLES } from 'lib/constants';
import { successToast, errorToast } from 'utils/toasts';
import ucfirst from 'utils/ucfirst';
import BlockUI from 'components/Utils/BlockUI';
import RadioButtons from 'components/RadioButtons';
import Form from 'components/Form';
import FormFooter from 'components/Form/FormFooter';
import LilyEditor from 'components/LilyEditor';
import TemplateVariable from 'models/TemplateVariable';

class InnerTemplateVariableForm extends Component {
  constructor(props) {
    super(props);

    this.editorRef = React.createRef();

    this.state = {
      categories: {},
      variables: [],
      category: '',
      variable: ''
    };
  }

  async componentDidMount() {
    const { id } = this.props.match.params;

    if (id) {
      const templateVariable = await TemplateVariable.get(id);

      this.props.setValues(templateVariable);

      document.title = `${templateVariable.name} - Lily`;
    } else {
      document.title = 'Add template variable - Lily';
    }

    const variableResponse = await TemplateVariable.query();
    const categories = variableResponse.default;
    categories.custom = variableResponse.custom;

    this.setState({ categories });
  }

  getOptions = options =>
    Object.keys(options).map(option => ({ value: option, label: ucfirst(option) }));

  handleSubmit = event => {
    const text = this.editorRef.current.getHtml();

    // The content of the editor is maintained in the editor itself.
    // So retrieve the value and update the form value.
    this.props.setFieldValue('text', text);
    this.props.handleSubmit(event);
  };

  handleCategory = selected => {
    const { categories } = this.state;

    const variables = categories[selected.value].map(variable => ({
      value: variable,
      label: ucfirst(variable.replace(/_/g, ' '))
    }));

    this.setState({ category: selected.value, variables });
  };

  handleVariable = selected => {
    this.setState({ variable: selected.value });
  };

  insertVariable = () => {
    const { category, variable } = this.state;

    this.editorRef.current.insertHtml(`[[ ${category}.${variable} ]]`);
  };

  render() {
    const { categories, variables, category, variable } = this.state;
    const { values, errors, isSubmitting, handleChange } = this.props;

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
              <Form handleSubmit={this.handleSubmit}>
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

                <div className="form-field">
                  <label htmlFor="category">Variables</label>

                  <div className="display-flex">
                    <Select
                      name="category"
                      styles={SELECT_STYLES}
                      className="flex-grow"
                      options={this.getOptions(categories)}
                      onChange={this.handleCategory}
                      placeholder="Select a category"
                    />

                    <Select
                      name="variable"
                      styles={SELECT_STYLES}
                      className="flex-grow m-l-10"
                      options={variables}
                      onChange={this.handleVariable}
                      placeholder="Select a variable"
                    />
                  </div>
                </div>

                {category && variable && (
                  <div className="form-field">
                    <div>Variable preview</div>
                    <div>
                      <code>{`[[ ${category}.${variable} ]]`}</code>

                      <button
                        className="hl-primary-btn m-l-10"
                        onClick={this.insertVariable}
                        type="button"
                      >
                        Insert
                      </button>
                    </div>
                  </div>
                )}

                <div className={`form-field${errors.text ? ' has-error' : ''}`}>
                  <label htmlFor="text" required>
                    Content
                  </label>

                  <div className="editor">
                    <LilyEditor ref={this.editorRef} fullPage={false} />
                  </div>

                  {errors.text && <div className="error-message">{errors.text}</div>}
                </div>

                <div className="form-field">
                  <label>Is public</label>
                  <RadioButtons
                    options={['No', 'Yes']}
                    setSelection={value => this.props.setFieldValue('isPublic', value)}
                  />
                </div>

                <FormFooter {...this.props} indent={false} handleSubmit={this.handleSubmit} />
              </Form>
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
          errorToast(t('error'));
          setErrors(errors.data);
          setSubmitting(false);
        });
    },
    displayName: 'TemplateVariableForm'
  })(InnerTemplateVariableForm)
);

export default withNamespaces('toasts')(withContext(TemplateVariableForm));
