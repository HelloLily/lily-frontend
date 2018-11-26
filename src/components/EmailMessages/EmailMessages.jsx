import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withNamespaces } from 'react-i18next';
import { debounce } from 'debounce';

import {
  NEEDS_ALL,
  NEEDS_CONTACT,
  NEEDS_ACCOUNT,
  COMPLETE,
  TRASH_LABEL,
  DEBOUNCE_WAIT
} from 'lib/constants';
import getColorCode from 'utils/getColorCode';
import BlockUI from 'components/Utils/BlockUI';
import LilyDate from 'components/Utils/LilyDate';
import SearchBar from 'components/List/SearchBar';
import ContactIcon from 'components/ContactIcon';
import Dropdown from 'components/Dropdown';
import EmailMessage from 'models/EmailMessage';

class EmailMessages extends Component {
  constructor(props) {
    super(props);

    this.debouncedSearch = debounce(this.loadItems, DEBOUNCE_WAIT);

    this.state = {
      emailMessages: [],
      loading: true,
      selectAll: false,
      lastSelected: null,
      showReplyActions: false,
      showMoveTo: false
    };
  }

  async componentDidMount() {
    this.loadItems();
  }

  async componentDidUpdate(prevProps) {
    const { currentEmailAccount, currentLabel } = this.props;
    const prevEmailAccount = prevProps.currentEmailAccount;

    let shouldUpdate = false;

    if (prevEmailAccount !== currentEmailAccount) {
      shouldUpdate = true;
    }

    const prevLabel = prevProps.currentLabel;

    if (prevLabel !== currentLabel) {
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      this.loadItems();
    }
  }

  getContactStatus = async emailMessage => {
    let status = COMPLETE;

    if (emailMessage.senderEmail) {
      const searchRequest = await EmailMessage.searchEmailAddress(emailMessage.senderEmail);
      const { type } = searchRequest;

      if (type === 'contact') {
        if (searchRequest.data.accounts) {
          // Found item is a contact and is linked to accounts.
          status = COMPLETE;
        } else {
          // Found item is a contact, but not linked to any accounts.
          status = NEEDS_ACCOUNT;
        }
      } else if (type === 'account') {
        if (searchRequest.complete) {
          // Found item is an account and has a contact linked to it.
          status = COMPLETE;
        } else {
          // Found item is an account, but is missing a contact.
          status = NEEDS_CONTACT;
        }
      } else {
        status = NEEDS_ALL;
      }
    }

    return status;
  };

  getEmailHeader = () => {
    const { currentEmailAccount, currentLabel } = this.props;

    // Display the account's email address if there's an account selected.
    let header = currentEmailAccount ? currentEmailAccount.emailAddress : 'All mailboxes';

    if (currentLabel) {
      // Don't display 'All mail' text when there's no email account selected.
      if (!(!currentEmailAccount && !currentLabel.labelId)) {
        header += ` - ${currentLabel.name}`;
      }
    }

    return header;
  };

  handleSearch = query => {
    this.setState({ query }, this.debouncedSearch);
  };

  setPage = async page => {
    this.setState({ page }, this.loadItems);
  };

  loadItems = async () => {
    this.setState({ loading: true });
    // TODO: Include value from search field.
    const params = {
      emailAccount: this.props.currentEmailAccount,
      label: this.props.currentLabel,
      page: this.state.page
    };
    const messageResponse = await EmailMessage.query(params);
    // Fetch contact status for each message.
    const emailMessagePromises = messageResponse.results.map(async emailMessage => {
      // const history = await EmailMessage.history(emailMessage.id);

      // emailMessage.history = history;
      emailMessage.status = await this.getContactStatus(emailMessage);

      return emailMessage;
    });

    const emailMessages = await Promise.all(emailMessagePromises);

    this.setState({ emailMessages, loading: false });
  };

  toggleSelectAll = () => {
    const { emailMessages, selectAll } = this.state;

    emailMessages.forEach(message => {
      // Set checked status for each message based on
      // the opposite value of the 'Select all' checkbox.
      message.checked = !selectAll;
    });

    this.setState({ selectAll: !selectAll, emailMessages });
  };

  toggleStarred = emailMessage => {
    const { emailMessages } = this.state;
    const data = { id: emailMessage.id, starred: !emailMessage.isStarred };

    EmailMessage.star(data).then(response => {
      const index = emailMessages.findIndex(email => email.id === emailMessage.id);
      emailMessages[index].isStarred = response.isStarred;

      this.setState({ emailMessages });
    });
  };

  removeCheckedMessages = () => {
    const { emailMessages } = this.state;

    const filteredMessages = emailMessages.filter(message => !message.checked);

    this.setState({ emailMessages: filteredMessages });
  };

  archive = () => {
    const { emailMessages } = this.state;

    emailMessages.forEach(message => {
      if (message.checked) {
        const data = {
          id: message.id,
          data: {
            currentInbox: this.props.currentLabel
          }
        };

        EmailMessage.archive(data);
      }
    });

    this.removeCheckedMessages();
  };

  delete = () => {
    const { emailMessages, currentLabel } = this.state;

    emailMessages.forEach(message => {
      if (message.checked) {
        if (currentLabel === TRASH_LABEL) {
          // Message has already been trashed, so permanently delete the message.
          EmailMessage.del(message.id);
        } else {
          EmailMessage.trash(message.id);
        }
      }
    });

    this.removeCheckedMessages();
  };

  markAsRead = () => {
    this.updateReadStatus(true);
  };

  markAsUnread = () => {
    this.updateReadStatus(false);
  };

  updateReadStatus = status => {
    const { emailMessages } = this.state;

    emailMessages.forEach(message => {
      if (message.checked) {
        EmailMessage.patch({ id: message.id, read: status });

        message.read = status;
      }
    });

    this.setState({ emailMessages });
  };

  move = label => {
    const { emailMessages, currentLabel } = this.state;
    const addedLabels = [label.labelId];
    const removedLabels = currentLabel ? [currentLabel] : [];

    // Gmail API needs to know the new labels as well as the old ones, so send them too.
    const data = {
      addLabels: addedLabels,
      removeLabels: removedLabels
    };

    emailMessages.forEach(message => {
      if (message.checked) {
        EmailMessage.move({ id: message.id, data });
      }
    });

    this.removeCheckedMessages();
  };

  handleSelect = (event, index) => {
    const { emailMessages, lastSelected } = this.state;

    // Set the last selected item.
    this.setState({ lastSelected: index });

    emailMessages[index].checked = !emailMessages[index].checked;

    // Check if someone wants to select multiple items.
    // If so, we want to (un)check all messages between the last and current selected message.
    if (event.shiftKey) {
      if (lastSelected < index) {
        //  We're going from top to bottom, so increment i.
        for (let i = lastSelected; i < index; i++) {
          emailMessages[i].checked = emailMessages[index].checked;
        }
      } else {
        // Going from bottom to top, so decrement i.
        for (let i = lastSelected; i > index; i--) {
          emailMessages[i].checked = emailMessages[index].checked;
        }
      }
    }

    const checkedMessages = emailMessages.filter(message => message.checked);
    // It's not possible to reply to multiple messages at the same time.
    const showReplyActions = checkedMessages.length === 1;
    const showMoveTo = this.props.currentEmailAccount && checkedMessages.length > 0;

    this.setState({ emailMessages, showReplyActions, showMoveTo });
  };

  render() {
    const { emailMessages, showReplyActions, showMoveTo, loading, selectAll, query } = this.state;
    const { currentEmailAccount, currentLabel, t } = this.props;

    let filteredLabels = [];

    if (currentEmailAccount) {
      // Filter out labels added by the email provider.
      // Also filter out the currently selected label.
      // Finally sort by name.
      filteredLabels = currentEmailAccount.labels
        .filter(
          label => label.labelType !== 0 && (currentLabel && currentLabel.labelId !== label.labelId)
        )
        .sort((a, b) => a.name.localeCompare(b.name));
    }

    return (
      <BlockUI blocking={loading}>
        <div className="email-messages">
          <div className="list">
            <div className="list-header">
              <div className="list-title">{this.getEmailHeader()}</div>
            </div>

            <div className="list-header">
              <input
                type="checkbox"
                onChange={this.toggleSelectAll}
                checked={selectAll}
                className="m-r-10"
              />

              <div className="hl-btn-group m-r-10">
                <button className="hl-primary-btn" onClick={this.archive}>
                  <FontAwesomeIcon icon="archive" /> Archive
                </button>

                <button className="hl-primary-btn" onClick={this.delete}>
                  <i className="lilicon hl-trashcan-icon" /> Delete
                </button>
              </div>

              {showMoveTo && (
                <Dropdown
                  clickable={
                    <div className="hl-primary-btn m-r-10">
                      <FontAwesomeIcon icon="folder" /> Move to
                      <i className="lilicon hl-toggle-down-icon m-l-5" />
                    </div>
                  }
                  menu={
                    <ul className="dropdown-menu">
                      {filteredLabels.map(label => (
                        <li className="dropdown-menu-item" key={label.id}>
                          <button className="dropdown-button" onClick={() => this.move(label)}>
                            {label.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  }
                />
              )}

              <div className="hl-btn-group m-r-10">
                <button className="hl-primary-btn" onClick={this.markAsRead}>
                  <FontAwesomeIcon icon="eye" /> Mark as read
                </button>
                <button className="hl-primary-btn" onClick={this.markAsUnread}>
                  <FontAwesomeIcon icon="eye-slash" /> Mark as unread
                </button>
              </div>

              <button className="hl-primary-btn m-r-10" onClick={this.refresh}>
                <FontAwesomeIcon icon="sync-alt" /> Refresh
              </button>

              {showReplyActions && (
                <div className="hl-btn-group m-r-10">
                  <Link to="/email" className="hl-primary-btn">
                    <FontAwesomeIcon icon="reply" /> Reply
                  </Link>

                  <Link to="/email" className="hl-primary-btn">
                    <FontAwesomeIcon icon="reply-all" /> Reply all
                  </Link>

                  <Link to="/email" className="hl-primary-btn">
                    <FontAwesomeIcon icon="reply" flip="horizontal" /> Forward
                  </Link>
                </div>
              )}

              <div className="flex-grow" />

              <SearchBar query={query} searchCallback={this.handleSearch} />
            </div>

            <table className="hl-table">
              <tbody>
                {emailMessages.map((emailMessage, index) => {
                  // TODO: Currently doesn't work since the
                  // email message's data doesn't contain the color.
                  const color =
                    emailMessage.account.color || getColorCode(emailMessage.account.email);

                  return (
                    <tr key={emailMessage.id} className={!emailMessage.read ? 'unread' : ''}>
                      <td>
                        <label htmlFor={`message-${emailMessage.id}`}>
                          <input
                            readOnly
                            id={`message-${emailMessage.id}`}
                            type="checkbox"
                            onClick={event => this.handleSelect(event, index)}
                            checked={emailMessage.checked || false}
                          />
                        </label>
                      </td>
                      <td>
                        <button
                          className={`hl-interface-btn larger${
                            emailMessage.isStarred ? ' star-active' : ''
                          }`}
                          onClick={() => this.toggleStarred(emailMessage)}
                        >
                          {emailMessage.isStarred ? (
                            <FontAwesomeIcon icon="star" className="yellow" />
                          ) : (
                            <FontAwesomeIcon icon={['far', 'star']} />
                          )}
                        </button>
                      </td>
                      <td>
                        <div className="account-label" style={{ borderLeftColor: color }}>
                          {emailMessage.account.name || emailMessage.account.email}
                        </div>
                      </td>
                      <td>
                        <ContactIcon emailMessage={emailMessage} />
                      </td>
                      <td className="navigation-cell">
                        <Link to={`/email/${emailMessage.id}`}>
                          {emailMessage.senderName || emailMessage.senderEmail}
                        </Link>
                      </td>
                      {/* <td>{emailMessage.receivedByName && emailMessage.receivedByName.join(', ')}</td>
                      <td>{emailMessage.receivedByEmail && emailMessage.receivedByEmail.join(', ')}</td> */}
                      <td className="navigation-cell">
                        <Link to={`/email/${emailMessage.id}`}>
                          {emailMessage.history && emailMessage.history.repliedWith && (
                            <FontAwesomeIcon icon="reply" />
                          )}
                        </Link>
                      </td>
                      <td className="navigation-cell">
                        <Link to={`/email/${emailMessage.id}`}>
                          {emailMessage.hasAttachment && (
                            <i className="lilicon hl-paperclip-icon" />
                          )}
                        </Link>
                      </td>
                      <td className="navigation-cell">
                        <Link to={`/email/${emailMessage.id}`}>{emailMessage.subject}</Link>
                      </td>
                      <td>
                        <LilyDate date={emailMessage.sentDate} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* TODO: Should check the amount of created email accounts */}
            {false && (
              <div>
                <div className="empty-state-overlay" />
                <div className="empty-state-description">
                  <h3>{t('email.title')}</h3>

                  <p>{t('email.line1')}</p>
                  <p>{t('email.line2')}</p>
                  <p>{t('email.line3')}</p>
                  <p>
                    {t('email.line4')}
                    <Link to="/preferences/emailaccounts/create" className="hl-primary-btn m-l-5">
                      <FontAwesomeIcon icon="plus" /> Email account
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </BlockUI>
    );
  }
}

export default withNamespaces('emptyStates')(EmailMessages);
