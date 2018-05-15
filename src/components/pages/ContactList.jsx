import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import List from 'components/List';
import LilyDate from 'components/utils/LilyDate';
import LilyPagination from 'components/LilyPagination';
import ListActions from 'components/List/ListActions';
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
            <NavLink to={`/email/compose/${account.primaryEmail.emailAddress}`}>
              <i className="lilicon hl-email-icon" /> {account.primaryEmail.emailAddress}
            </NavLink>
          )}
        {!contact.phoneNumber &&
          account.phoneNumber && (
            <React.Fragment>
              {account.phoneNumber.type === 'mobile' || account.phoneNumber.type === 'work' ? (
                <a href={`tel:${account.phoneNumber.number}`}>
                  {account.phoneNumber.type === 'mobile' ? (
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
            <h1>Contact list</h1>
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
                    <NavLink to={`/contacts/${contact.id}`}>{contact.fullName}</NavLink>
                  </td>
                  <td>
                    {contact.emailAddresses.map(emailAddress => (
                      <div key={emailAddress.id}>
                        {emailAddress.status !== 0 ? (
                          <NavLink to={`/email/compose/${emailAddress.emailAddress}`}>
                            <i className="lilicon hl-email-icon" /> {emailAddress.emailAddress}
                          </NavLink>
                        ) : null}
                      </div>
                    ))}
                    {contact.phoneNumbers.map(phone => (
                      <div key={phone.id}>
                        {phone.type === 'mobile' || phone.type === 'work' ? (
                          <a href={`tel:${phone.number}`}>
                            {phone.type === 'mobile' ? (
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
                        <NavLink to={`/accounts/${account.id}`}>{account.accountName}</NavLink>
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
                  <td>{contact.tags.map(tag => <div key={tag.id}>{tag.name}</div>)}</td>
                  <td>
                    <ListActions />
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
