import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import { NEEDS_ALL, NEEDS_CONTACT, NEEDS_ACCOUNT, COMPLETE } from 'lib/constants';
import List from 'components/List';
import LilyDate from 'components/Utils/LilyDate';
import ContactIcon from 'components/ContactIcon';
import EmailMessage from 'models/EmailMessage';

class EmailMessages extends Component {
  constructor(props) {
    super(props);

    this.state = { selectedMessages: [], emailMessages: [] };
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

    this.setState({ emailMessages });
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
          // Found item is a contact, but not linked to any accounts.
        } else {
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

  render() {
    const { selectedMessages, emailMessages } = this.state;
    const { colorCodes, emailAccount, label } = this.props;

    return (
      <div className="email-messages">
        <List>
          <div className="list-header">
            {emailAccount ? emailAccount.emailAddress : 'All mailboxes'} -{' '}
            {label ? label.name : 'Inbox'}
          </div>

          <table className="hl-table">
            <tbody>
              {emailMessages.map(emailMessage => (
                <tr key={emailMessage.id} className={!emailMessage.read ? 'unread' : ''}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>
                    <FontAwesomeIcon icon="star" className="yellow" />
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
                  <td>
                    <NavLink to={`/email/${emailMessage.id}`} exact>
                      {emailMessage.senderName || emailMessage.senderEmail}
                    </NavLink>
                  </td>
                  {/* <td>{emailMessage.receivedByName && emailMessage.receivedByName.join(', ')}</td>
                  <td>{emailMessage.receivedByEmail && emailMessage.receivedByEmail.join(', ')}</td> */}
                  <td>
                    <NavLink to={`/email/${emailMessage.id}`} exact>
                      {emailMessage.history &&
                        emailMessage.history.repliedWith && <FontAwesomeIcon icon="reply" />}
                    </NavLink>
                  </td>
                  <td>
                    <NavLink to={`/email/${emailMessage.id}`} exact>
                      {emailMessage.hasAttachment && <i className="lilicon hl-paperclip-icon" />}
                    </NavLink>
                  </td>
                  <td>
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
    );
  }
}

export default EmailMessages;
