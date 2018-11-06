import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFormik } from 'formik';
import { withNamespaces } from 'react-i18next';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { SELECT_STYLES } from 'lib/constants';
import { successToast, errorToast } from 'utils/toasts';
import ucfirst from 'utils/ucfirst';
import handleKeydown from 'utils/handleKeydown';
import BlockUI from 'components/Utils/BlockUI';
import LilyEditor from 'components/LilyEditor';
import TemplateVariable from 'models/TemplateVariable';
import EmailTemplateFolder from 'models/EmailTemplateFolder';
import EmailTemplate from 'models/EmailTemplate';

class InnerEmailTemplateForm extends Component {
  constructor(props) {
    super(props);

    this.editorRef = React.createRef();

    this.state = {
      folders: [],
      categories: {},
      variables: [],
      category: '',
      variable: ''
    };
  }

  async componentDidMount() {
    const { id } = this.props.match.params;

    if (id) {
      const emailTemplate = await EmailTemplate.get(id);

      this.props.setValues(emailTemplate);

      document.title = `${emailTemplate.name} - Lily`;
    } else {
      document.title = 'Add email template - Lily';
    }

    const folderResponse = await EmailTemplateFolder.query();
    const variableResponse = await TemplateVariable.query();
    const categories = variableResponse.default;
    categories.custom = variableResponse.custom;

    this.setState({
      folders: folderResponse.results,
      categories
    });
  }

  getOptions = options =>
    Object.keys(options).map(option => ({ value: option, label: ucfirst(option) }));

  handleSubmit = event => {
    const bodyHtml = this.editorRef.current.getHtml();

    // The content of the editor is maintained in the editor itself.
    // So retrieve the value and update the form value.
    this.props.setFieldValue('bodyHtml', bodyHtml);
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
    const { folders, categories, variables, category, variable } = this.state;
    const { values, errors, isSubmitting, handleChange } = this.props;

    return (
      <BlockUI blocking={isSubmitting}>
        <div className="content-block-container">
          <div className="content-block">
            <div className="content-block-header">
              <div className="content-block-name">
                {values.id ? (
                  <React.Fragment>Edit email template</React.Fragment>
                ) : (
                  <React.Fragment>Add email template</React.Fragment>
                )}
              </div>
            </div>

            <div className="content-block-content">
              <form onKeyDown={event => handleKeydown(event, this.handleSubmit)}>
                <div className={`form-field${errors.name ? ' has-error' : ''}`}>
                  <label htmlFor="name" required>
                    Template name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="hl-input"
                    placeholder="Template name"
                    value={values.name}
                    onChange={handleChange}
                  />

                  {errors.name && <div className="error-message">{errors.name}</div>}
                </div>

                <div className={`form-field${errors.subject ? ' has-error' : ''}`}>
                  <label htmlFor="subject" required>
                    Message subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    className="hl-input"
                    placeholder="Message subject"
                    value={values.subject}
                    onChange={handleChange}
                  />

                  {errors.subject && <div className="error-message">{errors.subject}</div>}
                </div>

                <div className={`form-field${errors.folder ? ' has-error' : ''}`}>
                  <label htmlFor="folder">Folder</label>
                  <Select
                    name="folder"
                    styles={SELECT_STYLES}
                    options={folders}
                    onChange={value => this.props.setFieldValue('folder', value)}
                    getOptionLabel={option => option.name}
                    getOptionValue={option => option.id}
                  />

                  {errors.folder && <div className="error-message">{errors.folder}</div>}
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

                {category &&
                  variable && (
                    <div className="form-field">
                      <div>Variable preview</div>
                      <div>
                        <code>{`[[ ${category}.${variable} ]]`}</code>

                        <button
                          className="hl-primary-btn m-l-10"
                          type="button"
                          onClick={this.insertVariable}
                        >
                          Insert
                        </button>
                      </div>
                    </div>
                  )}

                <div className={`form-field${errors.bodyHtml ? ' has-error' : ''}`}>
                  <label htmlFor="bodyHtml">HTML content</label>

                  <div className="editor">
                    <LilyEditor
                      ref={this.editorRef}
                      // modalOpen={this.state.modalOpen}
                    />
                  </div>

                  {errors.bodyHtml && <div className="error-message">{errors.bodyHtml}</div>}
                </div>

                <div className="form-section">
                  <div className="form-section-content">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="hl-primary-btn-blue"
                      onClick={this.handleSubmit}
                    >
                      <FontAwesomeIcon icon="check" /> Save
                    </button>

                    <button type="button" className="hl-primary-btn m-l-10" disabled={isSubmitting}>
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </BlockUI>
    );
  }
}

const EmailTemplateForm = withRouter(
  withFormik({
    mapPropsToValues: () => ({
      name: '',
      subject: '',
      folder: '',
      bodyText: '',
      bodyHtml: '',
      attachments: []
    }),
    handleSubmit: (values, { props, setSubmitting, setErrors }) => {
      const { t } = props;

      const cleanedValues = Object.assign({}, values);

      if (cleanedValues.folder) {
        cleanedValues.folder = cleanedValues.folder.id;
      }

      let request;
      let text;

      if (cleanedValues.id) {
        request = EmailTemplate.patch(cleanedValues);
        text = t('modelUpdated', { model: 'email template' });
      } else {
        request = EmailTemplate.post(cleanedValues);
        text = t('modelCreated', { model: 'email template' });
      }

      request
        .then(() => {
          successToast(text);

          props.history.push('/preferences/emailtemplates');
        })
        .catch(errors => {
          errorToast(t('error'));
          setErrors(errors.data);
          setSubmitting(false);
        });
    },
    displayName: 'EmailTemplateForm'
  })(InnerEmailTemplateForm)
);

export default withNamespaces('toasts')(EmailTemplateForm);
