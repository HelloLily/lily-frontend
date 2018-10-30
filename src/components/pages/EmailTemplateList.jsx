import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withNamespaces } from 'react-i18next';

import { successToast, errorToast } from 'utils/toasts';
import BlockUI from 'components/Utils/BlockUI';
import Editable from 'components/Editable';
import Dropdown from 'components/Dropdown';
import EmailTemplate from 'models/EmailTemplate';
import EmailTemplateFolder from 'models/EmailTemplateFolder';

class EmailTemplateList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      folders: [],
      templateCount: 0,
      loading: true,
      showMoveTo: false
    };

    document.title = 'Email templates';
  }

  async componentDidMount() {
    await this.loadItems();
  }

  loadItems = async () => {
    this.setState({ loading: true });

    const folderResponse = await EmailTemplateFolder.query();
    const templateResponse = await EmailTemplate.query({ folder__isnull: 'True' });
    const folders = [
      ...folderResponse.results,
      {
        name: 'Not in folder',
        emailTemplates: templateResponse.results
      }
    ];

    // Count the total amount of templates.
    const templateCount = folders.reduce((acc, folder) => acc + folder.emailTemplates.length, 0);

    this.setState({
      folders,
      templateCount,
      loading: false
    });
  };

  deleteFolder = folder => {
    const { folders } = this.state;

    // TODO: Add confirmation.
    EmailTemplateFolder.delete({ id: folder.id }).then(() => {
      this.setState({ folders });
    });
  };

  handleSelect = emailTemplate => {
    const { folders } = this.state;

    folders.forEach(folder => {
      folder.emailTemplates.forEach(template => {
        if (template.id === emailTemplate.id) {
          template.checked = !template.checked;
        }
      });
    });

    const showMoveTo =
      folders.reduce(
        (acc, folder) =>
          // Count the amount of selected email template.
          acc + folder.emailTemplates.filter(template => template.checked).length,
        0
      ) > 0;

    this.setState({ folders, showMoveTo });
  };

  handleName = event => {
    const { newFolder } = this.state;

    newFolder.name = event.target.value;

    this.setState({ newFolder });
  };

  addFolder = () => {
    this.setState({ newFolder: { name: '' } });
  };

  saveNewFolder = () => {
    const { folders, newFolder } = this.state;

    this.setState({ loading: true });

    EmailTemplateFolder.post(newFolder).then(response => {
      folders.unshift(response);

      this.setState({ folders, newFolder: null, loading: false });
    });
  };

  cancelNewFolder = () => {
    this.setState({ newFolder: null });
  };

  move = async folder => {
    const { folders } = this.state;
    const { t } = this.props;

    const moveTo = folder ? folder.id : null;
    const selected = folders.reduce((acc, currFolder) => {
      const filtered = currFolder.emailTemplates.filter(template => template.checked);

      if (filtered.length > 0) {
        acc.push(...filtered);
      }

      return acc;
    }, []);

    const templates = selected.map(item => item.id);

    if (selected.length > 0) {
      try {
        await EmailTemplate.move({ templates, folder: moveTo });

        successToast(t('templatesMoved'));

        await this.loadItems();
      } catch (error) {
        errorToast(t('error'));
      }
    }
  };

  toggleCollapse = index => {
    const { folders } = this.state;

    folders[index].collapsed = !folders[index].collapsed;

    this.setState({ folders });
  };

  render() {
    const { folders, templateCount, showMoveTo, newFolder, loading } = this.state;

    return (
      <BlockUI blocking={loading}>
        <div className="list">
          <div className="list-header">
            <div className="list-title flex-grow">Your email templates</div>

            {showMoveTo && (
              <Dropdown
                clickable={
                  <button className="hl-primary-btn m-r-10">
                    <FontAwesomeIcon icon="folder" /> Move to
                    <i className="lilicon hl-toggle-down-icon m-l-5" />
                  </button>
                }
                menu={
                  <ul className="dropdown-menu">
                    {folders.map(folder => (
                      <li className="dropdown-menu-item" key={folder.id || 'noFolder'}>
                        <button className="dropdown-button" onClick={() => this.move(folder)}>
                          {folder.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                }
              />
            )}

            <button className="hl-primary-btn m-r-10" onClick={this.addFolder}>
              <FontAwesomeIcon icon="plus" /> Template folder
            </button>

            <Link to="/preferences/emailtemplates/create" className="hl-primary-btn">
              <FontAwesomeIcon icon="plus" /> Email template
            </Link>
          </div>
          <table className="hl-table">
            <thead>
              <tr>
                <th className="w-60">Template name</th>
                <th className="float-right">Actions</th>
              </tr>
            </thead>
            {newFolder && (
              <tbody>
                <tr>
                  <td colSpan="2">
                    <div className="editable-wrap display-flex">
                      <input
                        type="text"
                        className="editable-input editable-has-buttons"
                        onChange={this.handleName}
                      />
                      <span className="editable-buttons">
                        <button onClick={this.saveNewFolder}>
                          <FontAwesomeIcon icon="check" />
                        </button>
                        <button onClick={this.cancelNewFolder}>
                          <FontAwesomeIcon icon="times" />
                        </button>
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            )}
            {folders.map(
              (folder, index) =>
                folder.id || (!folder.id && folder.emailTemplates.length > 0) ? (
                  <tbody key={folder.id || 'noFolder'}>
                    <tr className="email-template-folder-header">
                      <td colSpan="2">
                        <strong>
                          {folder.id ? (
                            <React.Fragment>
                              <Editable type="text" object={folder} field="name" />

                              <div className="float-right">
                                <button className="hl-interface-btn">
                                  <i className="lilicon hl-edit-icon" />
                                </button>

                                <button
                                  className="hl-interface-btn"
                                  onClick={() => this.deleteFolder(folder)}
                                >
                                  <i className="lilicon hl-trashcan-icon" />
                                </button>

                                {folder.emailTemplates.length > 0 && (
                                  <button
                                    className="hl-interface-btn"
                                    onClick={() => this.toggleCollapse(index)}
                                  >
                                    <i
                                      className={`lilicon hl-toggle-${
                                        folder.collapsed ? 'down' : 'up'
                                      }-icon`}
                                    />
                                  </button>
                                )}
                              </div>
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              {folder.name}

                              <div className="float-right">
                                <button
                                  className="hl-interface-btn"
                                  onClick={() => this.toggleCollapse(index)}
                                >
                                  <i
                                    className={`lilicon hl-toggle-${
                                      folder.collapsed ? 'down' : 'up'
                                    }-icon`}
                                  />
                                </button>
                              </div>
                            </React.Fragment>
                          )}
                        </strong>
                      </td>
                    </tr>

                    {!folder.collapsed ? (
                      <React.Fragment>
                        {folder.emailTemplates.map(emailTemplate => (
                          <tr key={emailTemplate.id}>
                            <td className="indented-cell">
                              <input
                                type="checkbox"
                                checked={emailTemplate.checked || false}
                                onChange={() => this.handleSelect(emailTemplate)}
                              />

                              <span> {emailTemplate.name}</span>

                              {emailTemplate.defaultFor.length > 0 && (
                                <div className="label m-l-5">
                                  Default for {emailTemplate.defaultFor.length} address(es)
                                </div>
                              )}
                            </td>
                            <td className="float-right">
                              <button className="hl-primary-btn small m-r-5">
                                <FontAwesomeIcon icon="star" className="yellow" /> Manage defaults
                              </button>

                              <button className="hl-primary-btn small m-r-5">
                                <i className="lilicon hl-edit-icon" />
                              </button>

                              <button
                                className="hl-primary-btn small"
                                onClick={() => this.delete()}
                              >
                                <i className="lilicon hl-trashcan-icon" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ) : null}
                  </tbody>
                ) : null
            )}

            {templateCount === 0 && (
              <tbody>
                <tr>
                  <td colSpan="2">No templates yet. You should create one!</td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </BlockUI>
    );
  }
}

export default withNamespaces('toasts')(EmailTemplateList);
