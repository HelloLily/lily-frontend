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
import Settings from 'models/Settings';
import Contact from 'models/Contact';

class ContactList extends Component {
  constructor(props) {
    super(props);

    this.settings = new Settings('contactList');

    const columns = [
      { key: 'name', text: 'Name', selected: true },
      { key: 'contactInformation', text: 'Contact information', selected: true },
      { key: 'worksAt', text: 'Works at', selected: true },
      { key: 'created', text: 'Created', selected: true },
      { key: 'modified', text: 'Modified', selected: true },
      { key: 'tags', text: 'Tags', selected: true }
    ];

    this.state = {
      columns,
      contacts: [],
      pagination: {},
      loading: true
    };
  }

  async componentDidMount() {
    const settingsResponse = await this.settings.get();
    const data = await Contact.query({ pageSize: 20 });

    this.setState({
      ...settingsResponse.results,
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

  toggleColumn = index => {
    const { columns } = this.state;

    columns[index].selected = !columns[index].selected;

    this.settings.store({ columns }).then(() => {
      this.setState({ columns });
    });
  };

  render() {
    const { columns, contacts, loading, pagination } = this.state;

    return (
      <BlockUI blocking={loading}>
        <List>
          <div className="list-header">
            <ColumnDisplay columns={columns} toggleColumn={this.toggleColumn} />
          </div>
          <table className="hl-table">
            <thead>
              <tr>
                {columns[0].selected && <th>Name</th>}
                {columns[1].selected && <th>Contact information</th>}
                {columns[2].selected && <th>Works at</th>}
                {columns[3].selected && <th>Created</th>}
                {columns[4].selected && <th>Modified</th>}
                {columns[5].selected && <th>Tags</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(contact => (
                <tr key={contact.id}>
                  {columns[0].selected && (
                    <td>
                      <Link to={`/contacts/${contact.id}`}>{contact.fullName}</Link>
                    </td>
                  )}
                  {columns[1].selected && (
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
                  )}
                  {columns[2].selected && (
                    <td>
                      {contact.functions.map(account => (
                        <div key={account.id}>
                          <Link to={`/accounts/${account.id}`}>{account.accountName}</Link>
                          {!account.isActive && <span> (inactive)</span>}
                        </div>
                      ))}
                    </td>
                  )}
                  {columns[3].selected && (
                    <td>
                      <LilyDate date={contact.created} />
                    </td>
                  )}
                  {columns[4].selected && (
                    <td>
                      <LilyDate date={contact.modified} />
                    </td>
                  )}
                  {columns[5].selected && (
                    <td>
                      {contact.tags.map(tag => (
                        <div key={tag.id}>{tag.name}</div>
                      ))}
                    </td>
                  )}
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
