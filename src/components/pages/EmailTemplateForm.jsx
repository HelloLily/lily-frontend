import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFormik } from 'formik';
import Select from 'react-select';

import { SELECT_STYLES } from 'lib/constants';
import BlockUI from 'components/Utils/BlockUI';
import FormFooter from 'components/Utils/FormFooter';
import EmailTemplateFolder from 'models/EmailTemplateFolder';
import EmailTemplate from 'models/EmailTemplate';

class InnerEmailTemplateForm extends Component {
  constructor(props) {
    super(props);

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

                <FormFooter {...this.props} />
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
      const request = EmailTemplate.post(values);

      request
        .then(() => {
          props.history.push('/preferences/emailtemplates');
        })
        .catch(errors => {
          setErrors(errors.data);
          setSubmitting(false);
        });
    },
    displayName: 'EmailTemplateForm'
  })(InnerEmailTemplateForm)
);

export default EmailTemplateForm;
