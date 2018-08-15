import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { INACTIVE_EMAIL_STATUS, MOBILE_PHONE_TYPE, WORK_PHONE_TYPE } from 'lib/constants';
import List from 'components/List';
import ColumnDisplay from 'components/List/ColumnDisplay';
import ListActions from 'components/List/ListActions';
import LilyPagination from 'components/LilyPagination';
import LilyDate from 'components/Utils/LilyDate';
import BlockUI from 'components/Utils/BlockUI';
import Contact from 'models/Contact';

class ContactList extends Component {
  constructor(props) {
    super(props);

    this.state = { contacts: [], pagination: {}, loading: true };
  }

  async componentDidMount() {
    const data = await Contact.query({ pageSize: 20 });

    this.setState({
      contacts: data.results,
      pagination: data.pagination,
      loading: false
    });
  }

  setPage = async page => {
    this.setState({ loading: true });

    const data = await Contact.query({ pageSize: 20, page });

    this.setState({
      contacts: data.results,
      pagination: data.pagination,
      loading: false
    });
  };

  getAccountInformation = contact =>
    contact.accounts.map(account => (
      <React.Fragment key={account.id}>
        {!contact.primaryEmail &&
          account.primaryEmail && (
            <Link to={`/email/compose/${account.primaryEmail.emailAddress}`}>
              <i className="lilicon hl-email-icon" /> {account.primaryEmail.emailAddress}
            </Link>
          )}
        {!contact.phoneNumber &&
          account.phoneNumber && (
            <React.Fragment>
              {account.phoneNumber.type === MOBILE_PHONE_TYPE ||
              account.phoneNumber.type === 'work' ? (
                <a href={`tel:${account.phoneNumber.number}`}>
                  {account.phoneNumber.type === MOBILE_PHONE_TYPE ? (
                    <FontAwesomeIcon icon="mobile" />
                  ) : (
                    <i className="lilicon hl-phone-filled-icon" />
                  )}

                  <span className="m-l-5">{account.phoneNumber.number}</span>
                </a>
              ) : null}
            </React.Fragment>
          )}
      </React.Fragment>
    ));

  render() {
    const { contacts, loading, pagination } = this.state;

    return (
      <BlockUI blocking={loading}>
        <List>
          <div className="list-header">
            <ColumnDisplay className="flex-grow" />
          </div>
          <table className="hl-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact information</th>
                <th>Works at</th>
                <th>Created</th>
                <th>Modified</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(contact => (
                <tr key={contact.id}>
                  <td>
                    <Link to={`/contacts/${contact.id}`}>{contact.fullName}</Link>
                  </td>
                  <td>
                    {contact.emailAddresses.map(emailAddress => (
                      <div key={emailAddress.id}>
                        {emailAddress.status !== INACTIVE_EMAIL_STATUS ? (
                          <Link to={`/email/compose/${emailAddress.emailAddress}`}>
                            <i className="lilicon hl-email-icon" /> {emailAddress.emailAddress}
                          </Link>
                        ) : null}
                      </div>
                    ))}
                    {contact.phoneNumbers.map(phone => (
                      <div key={phone.id}>
                        {phone.type === MOBILE_PHONE_TYPE || phone.type === WORK_PHONE_TYPE ? (
                          <a href={`tel:${phone.number}`}>
                            {phone.type === MOBILE_PHONE_TYPE ? (
                              <FontAwesomeIcon icon="mobile" />
                            ) : (
                              <i className="lilicon hl-phone-filled-icon" />
                            )}

                            <span className="m-l-5">{phone.number}</span>
                          </a>
                        ) : null}
                      </div>
                    ))}

                    {this.getAccountInformation(contact)}
                  </td>
                  <td>
                    {contact.functions.map(account => (
                      <div key={account.id}>
                        <Link to={`/accounts/${account.id}`}>{account.accountName}</Link>
                        {!account.isActive && <span> (inactive)</span>}
                      </div>
                    ))}
                  </td>
                  <td>
                    <LilyDate date={contact.created} />
                  </td>
                  <td>
                    <LilyDate date={contact.modified} />
                  </td>
                  <td>
                    {contact.tags.map(tag => (
                      <div key={tag.id}>{tag.name}</div>
                    ))}
                  </td>
                  <td>
                    <ListActions object={contact} {...this.props} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="list-footer">
            <LilyPagination setPage={this.setPage} pagination={pagination} />
          </div>
        </List>
      </BlockUI>
    );
  }
}

export default ContactList;
