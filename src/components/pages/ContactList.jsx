import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withTranslation } from 'react-i18next';
import debounce from 'debounce-promise';

import {
  INACTIVE_EMAIL_STATUS,
  MOBILE_PHONE_TYPE,
  WORK_PHONE_TYPE,
  DESCENDING_STATUS,
  DEBOUNCE_WAIT
} from 'lib/constants';
import ColumnDisplay from 'components/List/ColumnDisplay';
import ListActions from 'components/List/ListActions';
import LilyPagination from 'components/LilyPagination';
import LilyDate from 'components/Utils/LilyDate';
import EmailLink from 'components/Utils/EmailLink';
import ListColumns from 'components/List/ListColumns';
import SearchBar from 'components/List/SearchBar';
import BlockUI from 'components/Utils/BlockUI';
import LilyTooltip from 'components/LilyTooltip';
import Settings from 'models/Settings';
import Contact from 'models/Contact';

class ContactList extends Component {
  constructor(props) {
    super(props);

    this.mounted = false;
    this.settings = new Settings('contactList');
    this.debouncedSearch = debounce(this.loadItems, DEBOUNCE_WAIT);

    const columns = [
      { key: 'name', text: 'Name', selected: true, sort: 'firstName' },
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
      page: 1,
      sortColumn: 'modified',
      sortStatus: DESCENDING_STATUS,
      loading: true
    };

    document.title = 'Contacts - Lily';
  }

  async componentDidMount() {
    this.mounted = true;

    const settingsResponse = await this.settings.get();
    const existsResponse = await Contact.exists();
    const showEmptyState = !existsResponse.exists;

    if (this.mounted) {
      this.setState(
        {
          ...settingsResponse.results,
          page: 1,
          showEmptyState
        },
        this.loadItems
      );
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  setPage = async page => {
    this.setState({ page }, this.loadItems);
  };

  setSorting = async (sortColumn, sortStatus) => {
    await this.settings.store({ sortColumn, sortStatus });
    this.setState({ sortColumn, sortStatus }, this.loadItems);
  };

  getAccountInformation = contact => {
    const { t } = this.props;

    const tooltip = t('contactListInfoTooltip');

    return (
      <React.Fragment>
        {contact.accounts.map(account => (
          <React.Fragment key={account.id}>
            {!contact.primaryEmail && account.primaryEmail && (
              <div>
                <FontAwesomeIcon
                  icon={['far', 'building']}
                  data-tip={tooltip}
                  data-for={`account-${account.id}-email`}
                />
                <EmailLink state={{ emailAddress: account.primaryEmail.emailAddress }}>
                  <span> {account.primaryEmail.emailAddress}</span>
                </EmailLink>

                <LilyTooltip id={`account-${account.id}-email`} />
              </div>
            )}
            {!contact.phoneNumber && account.phoneNumber && (
              <React.Fragment>
                {account.phoneNumber.type === MOBILE_PHONE_TYPE ||
                account.phoneNumber.type === WORK_PHONE_TYPE ? (
                  <div>
                    <span data-tip={tooltip} data-for={`account-${account.id}-phone`}>
                      {account.phoneNumber.type === MOBILE_PHONE_TYPE ? (
                        <FontAwesomeIcon icon={['far', 'mobile']} fixedWidth />
                      ) : (
                        <FontAwesomeIcon icon={['far', 'phone']} flip="horizontal" fixedWidth />
                      )}
                    </span>

                    <a href={`tel:${account.phoneNumber.number}`}>
                      <span> {account.phoneNumber.number}</span>
                    </a>

                    <LilyTooltip id={`account-${account.id}-phone`} />
                  </div>
                ) : null}
              </React.Fragment>
            )}
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  };

  export = () => {
    const columns = this.state.columns.filter(column => column.selected).map(column => column.key);
    Contact.export({ columns });
  };

  toggleColumn = async index => {
    const { columns } = this.state;

    columns[index].selected = !columns[index].selected;

    await this.settings.store({ columns });
    this.setState({ columns });
  };

  handleSearch = query => {
    this.setState({ page: 1, query }, this.debouncedSearch);
  };

  loadItems = async () => {
    const { query, page, sortColumn, sortStatus } = this.state;

    this.setState({ loading: true });

    const data = await Contact.query({
      search: query,
      pageSize: 20,
      page,
      sortColumn,
      sortStatus
    });

    if (this.mounted) {
      this.setState({
        items: data.results,
        pagination: data.pagination,
        loading: false
      });
    }
  };

  removeItem = ({ id }) => {
    const { items } = this.state;

    const index = items.findIndex(item => item.id === id);
    items.splice(index, 1);

    this.setState({ items });
  };

  updateItem = newData => {
    const { items } = this.state;
    const { id } = newData;

    const index = items.findIndex(item => item.id === id);
    items[index] = newData;

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

            {/* <button className="hl-primary-btn" onClick={this.export}>
              <FontAwesomeIcon icon={['far', 'file-export']} /> Export contacts
            </button> */}

            <div className="flex-grow" />

            <SearchBar query={query} searchCallback={this.handleSearch} />
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
                <th className="table-actions">Actions</th>
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
                            <EmailLink state={{ emailAddress: emailAddress.emailAddress }}>
                              <FontAwesomeIcon icon={['far', 'envelope']} fixedWidth />
                              <span> {emailAddress.emailAddress}</span>
                            </EmailLink>
                          ) : null}
                        </div>
                      ))}
                      {contact.phoneNumbers.map(phone => (
                        <div key={phone.id}>
                          {phone.type === MOBILE_PHONE_TYPE || phone.type === WORK_PHONE_TYPE ? (
                            <a href={`tel:${phone.number}`}>
                              {phone.type === MOBILE_PHONE_TYPE ? (
                                <FontAwesomeIcon icon={['far', 'mobile']} fixedWidth />
                              ) : (
                                <FontAwesomeIcon
                                  icon={['far', 'phone']}
                                  flip="horizontal"
                                  fixedWidth
                                />
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
                    <ListActions
                      item={contact}
                      deleteCallback={this.removeItem}
                      submitCallback={this.updateItem}
                      {...this.props}
                    />
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

export default withTranslation('tooltips')(ContactList);
