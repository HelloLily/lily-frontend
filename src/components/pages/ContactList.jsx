import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  INACTIVE_EMAIL_STATUS,
  MOBILE_PHONE_TYPE,
  WORK_PHONE_TYPE,
  NO_SORT_STATUS
} from 'lib/constants';
import List from 'components/List';
import ColumnDisplay from 'components/List/ColumnDisplay';
import ListActions from 'components/List/ListActions';
import LilyPagination from 'components/LilyPagination';
import LilyDate from 'components/Utils/LilyDate';
import ListColumns from 'components/List/ListColumns';
import BlockUI from 'components/Utils/BlockUI';
import Settings from 'models/Settings';
import Contact from 'models/Contact';

class ContactList extends Component {
  constructor(props) {
    super(props);

    this.settings = new Settings('contactList');

    const columns = [
      { key: 'name', text: 'Name', selected: true, sort: 'lastName' },
      { key: 'contactInformation', text: 'Contact information', selected: true },
      { key: 'worksAt', text: 'Works at', selected: true, sort: 'accounts.name' },
      { key: 'created', text: 'Created', selected: true, sort: 'created' },
      { key: 'modified', text: 'Modified', selected: true, sort: 'modified' },
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
    await this.loadItems();

    this.setState({
      ...settingsResponse.results,
      loading: false,
      page: 1,
      sortColumn: '',
      sortStatus: NO_SORT_STATUS
    });
  }

  setPage = async page => {
    this.setState({ page }, this.loadItems);
  };

  setSorting = (sortColumn, sortStatus) => {
    this.setState({ sortColumn, sortStatus }, this.loadItems);
  };

  setFilters = async filters => {
    await this.settings.store({ filters });

    this.setState({ filters }, this.loadItems);
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

  export = () => {
    console.log('Exported contacts');
  };

  toggleColumn = async index => {
    const { columns } = this.state;

    columns[index].selected = !columns[index].selected;

    await this.settings.store({ columns });
    this.setState({ columns });
  };

  loadItems = async () => {
    const { page, sortColumn, sortStatus } = this.state;

    this.setState({ loading: true });

    const data = await Contact.query({
      pageSize: 20,
      page,
      sortColumn,
      sortStatus
    });

    this.setState({
      contacts: data.results,
      pagination: data.pagination,
      loading: false
    });
  };

  render() {
    const { columns, contacts, loading, pagination } = this.state;

    return (
      <BlockUI blocking={loading}>
        <List>
          <div className="list-header">
            <ColumnDisplay columns={columns} toggleColumn={this.toggleColumn} />

            <button className="hl-primary-btn" onClick={this.export}>
              Export contacts
            </button>
          </div>
          <table className="hl-table">
            <thead>
              <tr>
                <ListColumns columns={columns} setSorting={this.setSorting} />
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
            <LilyPagination setPage={this.setPage} pagination={pagination} page={this.state.page} />
          </div>
        </List>
      </BlockUI>
    );
  }
}

export default ContactList;
