import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withNamespaces } from 'react-i18next';

import {
  INACTIVE_EMAIL_STATUS,
  MOBILE_PHONE_TYPE,
  WORK_PHONE_TYPE,
  NO_SORT_STATUS
} from 'lib/constants';
import ColumnDisplay from 'components/List/ColumnDisplay';
import ListActions from 'components/List/ListActions';
import LilyPagination from 'components/LilyPagination';
import LilyDate from 'components/Utils/LilyDate';
import ListColumns from 'components/List/ListColumns';
import SearchBar from 'components/List/SearchBar';
import BlockUI from 'components/Utils/BlockUI';
import LilyTooltip from 'components/LilyTooltip';
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
      items: [],
      query: '',
      pagination: {},
      showEmptyState: false,
      loading: true
    };

    document.title = 'Contacts - Lily';
  }

  async componentDidMount() {
    const settingsResponse = await this.settings.get();
    const existsResponse = await Contact.exists();
    const showEmptyState = !existsResponse.exists;

    await this.loadItems();

    this.setState({
      ...settingsResponse.results,
      page: 1,
      sortColumn: '',
      sortStatus: NO_SORT_STATUS,
      showEmptyState
    });
  }

  setPage = async page => {
    this.setState({ page }, this.loadItems);
  };

  setSorting = (sortColumn, sortStatus) => {
    this.setState({ sortColumn, sortStatus }, this.loadItems);
  };

  getAccountInformation = contact => {
    const { t } = this.props;

    const tooltip = t('contactListInfoTooltip');

    return (
      <React.Fragment>
        {contact.accounts.map(account => (
          <React.Fragment key={account.id}>
            {!contact.primaryEmail &&
              account.primaryEmail && (
                <React.Fragment>
                  <i className="lilicon hl-company-icon" data-tip={tooltip} />
                  <Link to={`/email/compose/${account.primaryEmail.emailAddress}`}>
                    <span> {account.primaryEmail.emailAddress}</span>
                  </Link>
                </React.Fragment>
              )}
            {!contact.phoneNumber &&
              account.phoneNumber && (
                <React.Fragment>
                  {account.phoneNumber.type === MOBILE_PHONE_TYPE ||
                  account.phoneNumber.type === 'work' ? (
                    <React.Fragment>
                      <span data-tip={tooltip}>
                        {account.phoneNumber.type === MOBILE_PHONE_TYPE ? (
                          <FontAwesomeIcon icon="mobile" />
                        ) : (
                          <i className="lilicon hl-phone-filled-icon" />
                        )}
                      </span>

                      <a href={`tel:${account.phoneNumber.number}`}>
                        <span> {account.phoneNumber.number}</span>
                      </a>
                    </React.Fragment>
                  ) : null}
                </React.Fragment>
              )}
          </React.Fragment>
        ))}

        <LilyTooltip />
      </React.Fragment>
    );
  };

  export = () => {
    console.log('Exported contacts');
  };

  toggleColumn = async index => {
    const { columns } = this.state;

    columns[index].selected = !columns[index].selected;

    await this.settings.store({ columns });
    this.setState({ columns });
  };

  handleSearch = event => {
    this.setState({ query: event.target.value }, this.loadItems);
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
      items: data.results,
      pagination: data.pagination,
      loading: false
    });
  };

  removeItem = item => {
    const { items } = this.state;

    const index = items.findIndex(iterItem => iterItem.id === item.id);
    items.splice(index, 1);

    this.setState({ items });
  };

  render() {
    const { columns, items, query, pagination, sortColumn, sortStatus, page, loading } = this.state;
    const { t } = this.props;

    return (
      <BlockUI blocking={loading}>
        <div className="list">
          <div className="list-header">
            <ColumnDisplay columns={columns} toggleColumn={this.toggleColumn} />

            <button className="hl-primary-btn" onClick={this.export}>
              Export contacts
            </button>

            <div className="flex-grow" />

            <SearchBar query={query} handleSearch={this.handleSearch} />
          </div>
          <table className="hl-table">
            <thead>
              <tr>
                <ListColumns
                  columns={columns}
                  setSorting={this.setSorting}
                  sortColumn={sortColumn}
                  sortStatus={sortStatus}
                />
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(contact => (
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
                      {contact.functions.map(func => (
                        <div key={func.id}>
                          <Link to={`/accounts/${func.account}`}>{func.accountName}</Link>
                          {!func.isActive && <span> (inactive)</span>}
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
                    <ListActions item={contact} deleteCallback={this.removeItem} {...this.props} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {this.state.showEmptyState && (
            <div className="empty-state-description">
              <h3>{t('contacts.emptyStateTitle')}</h3>

              <p>{t('contacts.line1')}</p>
              <p>{t('contacts.line2')}</p>
              <p>{t('contacts.line3')}</p>
            </div>
          )}

          <div className="list-footer">
            <LilyPagination setPage={this.setPage} pagination={pagination} page={page} />
          </div>
        </div>
      </BlockUI>
    );
  }
}

export default withNamespaces('tooltips')(ContactList);
