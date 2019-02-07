import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withNamespaces } from 'react-i18next';
import debounce from 'debounce-promise';

import withContext from 'src/withContext';
import {
  NEEDS_ALL,
  NEEDS_CONTACT,
  NEEDS_ACCOUNT,
  COMPLETE,
  TRASH_LABEL,
  DEBOUNCE_WAIT
  // SENT_LABEL,
  // DRAFT_LABEL
} from 'lib/constants';
import BlockUI from 'components/Utils/BlockUI';
import LilyDate from 'components/Utils/LilyDate';
import SearchBar from 'components/List/SearchBar';
import ContactIcon from 'components/ContactIcon';
import Dropdown from 'components/Dropdown';
import EmailMessage from 'models/EmailMessage';

class EmailMessages extends Component {
  constructor(props) {
    super(props);

    this.mounted = false;
    this.debouncedSearch = debounce(this.loadItems, DEBOUNCE_WAIT);

    this.state = {
      query: '',
      emailMessages: [],
      page: 1,
      selectAll: false,
      lastSelected: null,
      showReplyActions: false,
      showActions: false,
      loading: true
    };
  }

  componentDidMount() {
    this.mounted = true;

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

  componentWillUnmount() {
    this.mounted = false;
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
    const { query, page } = this.state;
    const { currentLabel, currentEmailAccount } = this.props;

    const label = currentLabel ? currentLabel.labelId : null;
    const account = currentEmailAccount ? currentEmailAccount.id : null;

    this.setState({ loading: true });

    // TODO: Might need to change some of the keys so they match other API's?
    const params = {
      q: query,
      label,
      account,
      page,
      sort: '-sentDate',
      pageSize: 20
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

    if (this.mounted) {
      this.setState({ emailMessages, loading: false });
    }
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
    const showActions = this.props.currentEmailAccount && checkedMessages.length > 0;

    this.setState({ emailMessages, showReplyActions, showActions });
  };

  render() {
    const { emailMessages, showReplyActions, showActions, selectAll, query, loading } = this.state;
    const { currentEmailAccount, currentLabel, currentUser, t } = this.props;

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

              {showActions && (
                <React.Fragment>
                  <div className="hl-btn-group m-r-10">
                    <button className="hl-primary-btn" onClick={this.archive}>
                      <FontAwesomeIcon icon={['far', 'archive']} /> Archive
                    </button>

                    <button className="hl-primary-btn" onClick={this.delete}>
                      <FontAwesomeIcon icon={['far', 'trash-alt']} /> Delete
                    </button>
                  </div>

                  <Dropdown
                    clickable={
                      <div className="hl-primary-btn m-r-10">
                        <FontAwesomeIcon icon={['far', 'folder']} /> Move to
                        <FontAwesomeIcon icon={['far', 'angle-down']} className="m-l-5" />
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

                  <div className="hl-btn-group m-r-10">
                    <button className="hl-primary-btn" onClick={this.markAsRead}>
                      <FontAwesomeIcon icon={['far', 'eye']} /> Mark as read
                    </button>
                    <button className="hl-primary-btn" onClick={this.markAsUnread}>
                      <FontAwesomeIcon icon={['far', 'eye-slash']} /> Mark as unread
                    </button>
                  </div>
                </React.Fragment>
              )}

              {showReplyActions && (
                <div className="hl-btn-group m-r-10">
                  <Link to="/email" className="hl-primary-btn">
                    <FontAwesomeIcon icon={['far', 'reply']} /> Reply
                  </Link>

                  <Link to="/email" className="hl-primary-btn">
                    <FontAwesomeIcon icon={['far', 'reply-all']} /> Reply all
                  </Link>

                  <Link to="/email" className="hl-primary-btn">
                    <FontAwesomeIcon icon={['far', 'reply']} flip="horizontal" /> Forward
                  </Link>
                </div>
              )}

              <button className="hl-primary-btn m-r-10" onClick={this.loadItems}>
                <FontAwesomeIcon icon={['far', 'sync-alt']} /> Refresh
              </button>

              <div className="flex-grow" />

              <SearchBar query={query} searchCallback={this.handleSearch} />
            </div>

            <table className="hl-table">
              <tbody>
                {emailMessages.map((emailMessage, index) => {
                  // TODO: Currently doesn't work since the
                  // email message's data doesn't contain the color or email.
                  // const color =
                  //   emailMessage.account.color || getColorCode(emailMessage.account.email);
                  const color = '';

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
                          className={`hl-interface-btn${
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
                      {/* TODO: Implement this code once API is done. */}
                      {/* {currentLabel.name === SENT_LABEL && (
                        <td>
                          {emailMessage.receivedBy.length > 0 && (
                            emailMessage.receivedBy.map(receiver =>
                              receiver.name || receiver.emailAddress).join(', ')
                          )}
                        </td>
                      )}
                      {currentLabel.name === DRAFT_LABEL && (
                        <td>
                          {emailMessage.receivedBy.length > 0 && (
                            emailMessage.receivedBy.map(receiver =>
                              receiver.emailAddress).join(', ')
                          )}
                        </td>
                      )} */}
                      <td className="navigation-cell">
                        <Link to={`/email/${emailMessage.id}`}>
                          {emailMessage.history && emailMessage.history.repliedWith && (
                            <FontAwesomeIcon icon={['far', 'reply']} />
                          )}
                        </Link>
                      </td>
                      <td className="navigation-cell">
                        <Link to={`/email/${emailMessage.id}`}>
                          {emailMessage.hasAttachment && (
                            <FontAwesomeIcon icon={['far', 'paperclip']} />
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

            {currentUser.objectCounts.emailAccounts === 0 && (
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
                      <FontAwesomeIcon icon={['far', 'plus']} /> Email account
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

export default withNamespaces('emptyStates')(withContext(EmailMessages));
