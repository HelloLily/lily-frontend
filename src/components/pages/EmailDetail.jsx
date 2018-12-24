import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { TRASH_LABEL, PHONE_EMPTY_ROW } from 'lib/constants';
import withContext from 'src/withContext';
import LilyDate from 'components/Utils/LilyDate';
import LoadingIndicator from 'components/Utils/LoadingIndicator';
import AccountDetailWidget from 'components/ContentBlock/AccountDetailWidget';
import ContactListWidget from 'components/ContentBlock/ContactListWidget';
import ContactDetailWidget from 'components/ContentBlock/ContactDetailWidget';
import Dropdown from 'components/Dropdown';
import Account from 'models/Account';
import Contact from 'models/Contact';
import EmailAccount from 'models/EmailAccount';
import EmailMessage from 'models/EmailMessage';

class EmailDetail extends Component {
  constructor(props) {
    super(props);

    this.mounted = false;

    this.state = {
      emailMessage: null,
      emailAccount: null,
      plainText: false,
      recipients: []
    };
  }

  async componentDidMount() {
    this.mounted = true;

    const { id } = this.props.match.params;
    const { currentLabel } = this.props;
    const emailMessage = await EmailMessage.get(id);

    if (!emailMessage.read) {
      EmailMessage.patch({ id: emailMessage.id, read: true });
    }

    const emailAccount = await EmailAccount.get(emailMessage.account);

    // Filter out labels added by the email provider.
    // Also filter out the currently selected label.
    // Finally sort by name.
    emailAccount.labels = emailAccount.labels
      .filter(
        label => label.labelType !== 0 && (currentLabel && currentLabel.labelId !== label.labelId)
      )
      .sort((a, b) => a.name.localeCompare(b.name));

    const threadRequest = await EmailMessage.thread(id);
    const recipientsList = emailMessage.receivedBy.concat(emailMessage.receivedByCc);

    const recipientRequests = recipientsList.map(async recipient => {
      if (recipient.name) {
        const recipientRequest = await EmailMessage.searchEmailAddress(recipient.emailAddress);

        if (recipientRequest.type === 'contact') {
          recipient.contactId = recipientRequest.data.id || null;
        }
      }

      return recipient;
    });

    const recipients = await Promise.all(recipientRequests);

    this.setupSidebar(emailMessage);

    if (this.mounted) {
      this.setState({
        emailMessage,
        emailAccount,
        recipients,
        thread: threadRequest.results
      });
    }

    document.title = 'Email message - Lily';
  }

  componentWillUnmount() {
    this.mounted = false;

    if (!this.props.sidebar) {
      // Clear the sidebar if it's been closed by the user
      // and they're navigating away from the email page.
      this.props.setSidebar(null, {});
    }
  }

  setupSidebar = async emailMessage => {
    if (emailMessage.sender && emailMessage.sender.emailAddress) {
      const sidebarData = {};
      let filterQuery = '';
      let website = '';
      let sidebarType = null;
      // Search an account or contact with the given email address.
      const response = await Account.query({ search: emailMessage.sender.emailAddress });
      const { type } = response;

      // Don't use the email addresses domain if
      // we're dealing with a free email provider (e.g. Gmail).
      if (!response.freeMail) {
        [website] = emailMessage.sender.emailAddress.split('@').slice(-1);
        sidebarData.website = website;
      }

      // Response contains actual data so continue processing.
      if (response && response.data) {
        if (type === 'account') {
          if (response.data.id) {
            sidebarData.account = await Account.get(response.data.id);

            if (!response.complete) {
              // Account found, but no contact belongs to account, so setup autofill data.
              sidebarType = 'contact';
            }

            filterQuery = `account.id:${response.data.id}`;
          }
        } else if (type === 'contact') {
          const contact = response.data;

          if (contact.id) {
            sidebarData.contact = await Contact.get(contact.id);

            if (contact.accounts && contact.accounts.length > 0) {
              if (contact.accounts.length === 1) {
                // Contact is linked to a single account, so autofill that account.
                sidebarData.account = await Account.get(contact.accounts[0].id);

                filterQuery = `contact.id:${contact.id} OR account.id:${contact.accounts[0].id}`;
              } else {
                const accountIds = contact.accounts.map(account => account.id);
                const accountQuery = `(${accountIds.join(
                  ' OR '
                )}) AND email_addresses.email_address:${website}`;
                // Contact works at multiple accounts, so try to filter accounts based on domain.
                // TODO: This needs to be a custom API call.
                const searchResponse = await Account.query({ search: accountQuery });

                if (searchResponse.objects.length) {
                  // If we get multiple accounts, just pick the first one.
                  // Additional filter isn't really possible.
                  [sidebarData.account] = searchResponse.objects;

                  filterQuery = `contact.id: ${contact.id} OR account.id:${
                    searchResponse.objects[0].id
                  }`;
                }
              }
            } else if (!response.freeMail) {
              sidebarType = 'account';
            }
          }
        }
      } else if (response.freeMail) {
        sidebarType = 'contact';
      } else {
        sidebarType = 'account';
      }

      if (type !== 'contact') {
        const senderParts = emailMessage.sender.name.split(' ');

        sidebarData.contact = {
          firstName: senderParts[0],
          lastName: senderParts.slice(1).join(' '),
          emailAddress: emailMessage.sender.emailAddress
        };

        if (sidebarData.account) {
          const account = sidebarData.account.id;
          const extractResponse = await EmailMessage.extract({ id: emailMessage.id, account });
          const phoneNumbers = extractResponse.phoneNumbers.map(number => {
            const phoneRow = PHONE_EMPTY_ROW;
            phoneRow.number = number;

            return phoneRow;
          });

          sidebarData.contact.phoneNumbers = phoneNumbers;
        }
      }

      if (sidebarType || sidebarData) {
        sidebarData.emailMessageLink = window.location.href;
        this.props.setSidebar(sidebarType, sidebarData);
      }
    }
  };

  togglePlainText = () => {
    const { plainText } = this.state;

    this.setState({ plainText: !plainText });
  };

  toggleStarred = () => {
    const { emailMessage } = this.state;
    const data = { id: emailMessage.id, starred: !emailMessage.isStarred };

    EmailMessage.star(data).then(response => {
      emailMessage.isStarred = response.isStarred;

      this.setState({ emailMessage });
    });
  };

  archive = () => {
    const { emailMessage } = this.state;
    const { currentLabel } = this.props;

    const data = {
      id: emailMessage.id
    };

    if (currentLabel) {
      data.data = {
        currentInbox: this.props.currentLabel.labelId
      };
    }

    EmailMessage.archive(data).then(() => {
      this.props.history.push(`/email`);
    });
  };

  delete = () => {
    const { emailMessage } = this.state;
    const { currentLabel } = this.props;

    let promise = null;

    if (currentLabel === TRASH_LABEL) {
      // Message has already been trashed, so permanently delete the message.
      promise = EmailMessage.del(emailMessage.id);
    } else {
      promise = EmailMessage.trash(emailMessage.id);
    }

    promise.then(() => {
      this.props.history.push(`/email`);
    });
  };

  markAsUnread = () => {
    const { emailMessage } = this.state;

    EmailMessage.archive({ id: emailMessage.id, read: false }).then(() => {
      this.props.history.push(`/email`);
    });
  };

  move = label => {
    const { emailMessage } = this.state;
    const { currentLabel } = this.props;

    const addedLabels = [label.labelId];
    const removedLabels = currentLabel ? [currentLabel] : [];

    // Gmail API needs to know the new labels as well as the old ones, so send them too.
    const data = {
      addLabels: addedLabels,
      removeLabels: removedLabels
    };

    EmailMessage.move({ id: emailMessage.id, data }).then(() => {
      this.props.history.push(`/email`);
    });
  };

  render() {
    const { emailMessage, emailAccount, recipients, thread, plainText } = this.state;
    const { data } = this.props;

    const recipientElements = recipients.map(recipient => {
      let element;

      if (recipient.name) {
        if (recipient.contactId) {
          element = (
            <React.Fragment>
              <Link to={`/contacts/${recipient.contactId}`}>{recipient.name}</Link>

              {` <${recipient.emailAddress}>`}
            </React.Fragment>
          );
        } else {
          element = (
            <React.Fragment>{`${recipient.name} <${recipient.emailAddress}>`}</React.Fragment>
          );
        }
      } else {
        element = recipient.emailAddress;
      }

      return <React.Fragment key={recipient.id}>{element}</React.Fragment>;
    });

    return (
      <React.Fragment>
        {emailMessage ? (
          <React.Fragment>
            <div className="email-detail">
              <div className="email-subject">
                <span className="header">{emailMessage.subject}</span>
              </div>

              <div className="email-actions">
                <div className="hl-btn-group m-r-10">
                  <Link to={`/email/compose/${emailMessage.id}`} className="hl-primary-btn">
                    <FontAwesomeIcon icon="reply" /> Reply
                  </Link>

                  <Dropdown
                    clickable={
                      <button className="hl-primary-btn" type="button">
                        <FontAwesomeIcon icon="angle-down" />
                      </button>
                    }
                    menu={
                      <ul className="dropdown-menu">
                        <li className="dropdown-menu-item">
                          <Link
                            to={`/email/compose/${emailMessage.id}`}
                            className="dropdown-button"
                          >
                            <FontAwesomeIcon icon="reply-all" /> Reply all
                          </Link>
                        </li>

                        <li className="dropdown-menu-item">
                          <Link to="/email" className="dropdown-button">
                            <FontAwesomeIcon icon="arrow-alt-right" /> Forward
                          </Link>
                        </li>
                      </ul>
                    }
                  />
                </div>

                <div className="hl-btn-group m-r-10">
                  <button className="hl-primary-btn" onClick={this.archive}>
                    <FontAwesomeIcon icon="archive" /> Archive
                  </button>
                  <button className="hl-primary-btn" onClick={this.delete}>
                    <i className="lilicon hl-trashcan-icon" /> Delete
                  </button>
                </div>

                <Dropdown
                  clickable={
                    <button className="hl-primary-btn" type="button">
                      <FontAwesomeIcon icon="folder" /> Move to
                      <i className="lilicon hl-toggle-down-icon m-l-5" />
                    </button>
                  }
                  menu={
                    <ul className="dropdown-menu">
                      {emailAccount.labels.map(label => (
                        <li className="dropdown-menu-item" key={label.id}>
                          <button className="dropdown-button" onClick={() => this.move(label)}>
                            {label.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  }
                />
              </div>

              <div className="email-info">
                <div className="email-info-top">
                  <strong>{emailMessage.sender.name}</strong>
                  <span className="email-sender-email m-l-5">
                    &lt;
                    {emailMessage.sender.emailAddress}
                    &gt;
                  </span>

                  <button
                    className={`hl-interface-btn larger${
                      emailMessage.isStarred ? ' star-active' : ''
                    }`}
                    onClick={this.toggleStarred}
                  >
                    {emailMessage.isStarred ? (
                      <FontAwesomeIcon icon="star" className="yellow" />
                    ) : (
                      <FontAwesomeIcon icon={['far', 'star']} />
                    )}
                  </button>

                  <LilyDate date={emailMessage.sentDate} />
                </div>

                <div className="email-info-bottom">
                  <div className="email-recipients">
                    <span>to </span>

                    {recipientElements.map((element, index) => (
                      <React.Fragment key={element.key}>
                        {element}
                        {index < recipientElements.length - 1 && <span>, </span>}
                      </React.Fragment>
                    ))}
                  </div>

                  <button className="plain-text-button" onClick={this.togglePlainText}>
                    {plainText ? 'Show HTML' : 'Show plain text'}
                  </button>
                </div>
              </div>

              <div className="email-content">
                {plainText ? (
                  <div>{emailMessage.bodyText}</div>
                ) : (
                  <iframe srcDoc={emailMessage.bodyHtml} title="Email message" />
                )}
              </div>
            </div>

            <div className="email-detail-widgets">
              {data.account && data.account.hasOwnProperty('id') && (
                <React.Fragment>
                  <AccountDetailWidget account={data.account} />

                  <ContactListWidget object={data.account} />
                </React.Fragment>
              )}

              {data.contact && data.contact.hasOwnProperty('id') && (
                <React.Fragment>
                  <ContactDetailWidget contact={data.contact} />
                </React.Fragment>
              )}
            </div>
          </React.Fragment>
        ) : (
          <LoadingIndicator />
        )}
      </React.Fragment>
    );
  }
}

export default withContext(withRouter(EmailDetail));
