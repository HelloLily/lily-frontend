import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFormik } from 'formik';
import { withNamespaces } from 'react-i18next';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { SELECT_STYLES } from 'lib/constants';
import { successToast, errorToast } from 'utils/toasts';
import BlockUI from 'components/Utils/BlockUI';
import LilyEditor from 'components/LilyEditor';
import EmailTemplateFolder from 'models/EmailTemplateFolder';
import EmailTemplate from 'models/EmailTemplate';

class InnerEmailTemplateForm extends Component {
  constructor(props) {
    super(props);

    this.editorRef = React.createRef();

    this.state = {
      folders: []
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

    this.setState({
      folders: folderResponse.results
    });
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
                  <React.Fragment>Edit email template</React.Fragment>
                ) : (
                  <React.Fragment>Add email template</React.Fragment>
                )}
              </div>
            </div>

            <div className="content-block-content">
              <form onSubmit={handleSubmit}>
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
                    options={this.state.folders}
                    onChange={value => this.props.setFieldValue('folder', value)}
                    getOptionLabel={option => option.name}
                    getOptionValue={option => option.id}
                  />

                  {errors.folder && <div className="error-message">{errors.folder}</div>}
                </div>

                <div className={`form-field${errors.bodyHtml ? ' has-error' : ''}`}>
                  <label htmlFor="bodyHtml">HTML content</label>

                  <div className="editor">
                    <LilyEditor
                      ref={this.editorRef}
                      // modalOpen={this.state.modalOpen}
                    />
                  </div>

                  {errors.folder && <div className="error-message">{errors.folder}</div>}
                </div>

                <div className="form-section">
                  <div className="form-section-content">
                    <button type="submit" disabled={isSubmitting} className="hl-primary-btn-blue">
                      <FontAwesomeIcon icon="check" />
                      Save
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
      let request;
      let text;

      if (values.id) {
        request = EmailTemplate.patch(values);
        text = t('modelUpdated', { model: 'email template' });
      } else {
        request = EmailTemplate.post(values);
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
