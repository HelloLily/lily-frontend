import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { NEEDS_ALL, NEEDS_CONTACT, NEEDS_ACCOUNT, COMPLETE } from 'lib/constants';
import List from 'components/List';
import BlockUI from 'components/Utils/BlockUI';
import LilyDate from 'components/Utils/LilyDate';
import ContactIcon from 'components/ContactIcon';
import EmailMessage from 'models/EmailMessage';

class EmailMessages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emailMessages: [],
      loading: true,
      selectAll: false,
      lastSelected: null,
      showReplyActions: false
    };
  }

  async componentDidMount() {
    const { label } = this.props;
    // TODO: Change from .hits to .results once there's a proper email message API.
    const messageRequest = await EmailMessage.query({ pageSize: 20, label });

    const emailMessagePromises = messageRequest.hits.map(async emailMessage => {
      const history = await EmailMessage.history(emailMessage.id);

      emailMessage.history = history;
      emailMessage.status = await this.getContactStatus(emailMessage);

      return emailMessage;
    });

    const emailMessages = await Promise.all(emailMessagePromises);

    this.setState({ emailMessages, loading: false });
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
    const { emailAccount, label } = this.props;

    // Display the account's email address if there's an account selected.
    let header = emailAccount ? emailAccount.emailAddress : 'All mailboxes';

    // Don't display 'All mail' text when there's no email account selected.
    if (!(!emailAccount && !label.labelId)) {
      header += ` - ${label.name}`;
    }

    return header;
  };

  toggleSelectAll = () => {
    const { emailMessages, selectAll } = this.state;

    emailMessages.forEach(message => {
      // Set checked status for each message based on the opposite value of the 'Select all' checkbox.
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

  archive = () => {
    const { emailMessages } = this.state;

    emailMessages.forEach(message => {
      if (message.checked) {
        const data = {
          id: message.id,
          data: {
            currentInbox: this.props.label
          }
        };

        EmailMessage.archive(data).then(() => {
          message.checked = false;
        });
      }
    });

    this.setState({ emailMessages });
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

    // It's not possible to reply to multiple messages at the same time.
    const showReplyActions = emailMessages.filter(message => message.checked).length === 1;

    this.setState({ emailMessages, showReplyActions });
  };

  render() {
    const { emailMessages, showReplyActions, loading, selectAll } = this.state;
    const { colorCodes } = this.props;

    return (
      <BlockUI blocking={loading}>
        <div className="email-messages">
          <List>
            <div className="list-header">
              <div className="list-title">{this.getEmailHeader()}</div>
            </div>

            <div className="list-header">
              <input
                type="checkbox"
                onClick={this.toggleSelectAll}
                checked={selectAll}
                className="m-r-10"
              />

              <div className="hl-btn-group m-r-10">
                <button className="hl-primary-btn" onClick={this.archive}>
                  <FontAwesomeIcon icon="archive" /> Archive
                </button>
                <button className="hl-primary-btn">
                  <i className="lilicon hl-trashcan-icon" /> Delete
                </button>
              </div>

              <div className="hl-btn-group m-r-10">
                <button className="hl-primary-btn">
                  <FontAwesomeIcon icon="eye" /> Mark as read
                </button>
                <button className="hl-primary-btn">
                  <FontAwesomeIcon icon="eye-slash" /> Mark as unread
                </button>
              </div>

              <button className="hl-primary-btn m-r-10">
                <FontAwesomeIcon icon="sync-alt" /> Refresh
              </button>

              {showReplyActions && (
                <div className="hl-btn-group m-r-10">
                  <button className="hl-primary-btn">
                    <FontAwesomeIcon icon="reply" /> Reply
                  </button>
                  <button className="hl-primary-btn">
                    <FontAwesomeIcon icon="reply-all" /> Reply all
                  </button>
                  <button className="hl-primary-btn">
                    <FontAwesomeIcon icon="reply" flip="horizontal" /> Forward
                  </button>
                </div>
              )}
            </div>

            <table className="hl-table">
              <tbody>
                {emailMessages.map((emailMessage, index) => (
                  <tr key={emailMessage.id} className={!emailMessage.read ? 'unread' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        onClick={event => this.handleSelect(event, index)}
                        checked={emailMessage.checked || false}
                      />
                    </td>
                    <td>
                      <button
                        className="hl-interface-btn larger"
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
                      <div
                        className="account-label"
                        style={{ borderLeftColor: colorCodes[emailMessage.account.id] }}
                      >
                        {emailMessage.account.name || emailMessage.account.email}
                      </div>
                    </td>
                    <td>
                      <ContactIcon emailMessage={emailMessage} />
                    </td>
                    <td className="navigation-cell">
                      <NavLink to={`/email/${emailMessage.id}`} exact>
                        {emailMessage.senderName || emailMessage.senderEmail}
                      </NavLink>
                    </td>
                    {/* <td>{emailMessage.receivedByName && emailMessage.receivedByName.join(', ')}</td>
                    <td>{emailMessage.receivedByEmail && emailMessage.receivedByEmail.join(', ')}</td> */}
                    <td className="navigation-cell">
                      <NavLink to={`/email/${emailMessage.id}`} exact>
                        {emailMessage.history &&
                          emailMessage.history.repliedWith && <FontAwesomeIcon icon="reply" />}
                      </NavLink>
                    </td>
                    <td className="navigation-cell">
                      <NavLink to={`/email/${emailMessage.id}`} exact>
                        {emailMessage.hasAttachment && <i className="lilicon hl-paperclip-icon" />}
                      </NavLink>
                    </td>
                    <td className="navigation-cell">
                      <NavLink to={`/email/${emailMessage.id}`} exact>
                        {emailMessage.subject}
                      </NavLink>
                    </td>
                    <td>
                      <LilyDate date={emailMessage.sentDate} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </List>
        </div>
      </BlockUI>
    );
  }
}

export default EmailMessages;
