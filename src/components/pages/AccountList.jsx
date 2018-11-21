import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withNamespaces } from 'react-i18next';
import { debounce } from 'debounce';

import { MOBILE_PHONE_TYPE, WORK_PHONE_TYPE, NO_SORT_STATUS, DEBOUNCE_WAIT } from 'lib/constants';
import ColumnDisplay from 'components/List/ColumnDisplay';
import ListActions from 'components/List/ListActions';
import Editable from 'components/Editable';
import LilyPagination from 'components/LilyPagination';
import LilyDate from 'components/Utils/LilyDate';
import ListColumns from 'components/List/ListColumns';
import ListFilter from 'components/List/ListFilter';
import SearchBar from 'components/List/SearchBar';
import BlockUI from 'components/Utils/BlockUI';
import Settings from 'models/Settings';
import Account from 'models/Account';

class AccountList extends Component {
  constructor(props) {
    super(props);

    this.settings = new Settings('accountList');
    this.debouncedSearch = debounce(this.loadItems, DEBOUNCE_WAIT);

    const columns = [
      { key: 'customerId', text: 'Customer ID', selected: false, sort: 'customerId' },
      { key: 'name', text: 'Name', selected: true, sort: 'name' },
      { key: 'contactInformation', text: 'Contact information', selected: true },
      { key: 'assignedTo', text: 'Assigned to', selected: true, sort: 'assignedTo' },
      { key: 'created', text: 'Created', selected: true, sort: 'created' },
      { key: 'modified', text: 'Modified', selected: true, sort: 'modified' },
      { key: 'status', text: 'Status', selected: true, sort: 'status' },
      { key: 'tags', text: 'Tags', selected: true }
    ];

    this.state = {
      columns,
      items: [],
      pagination: {},
      statuses: [],
      filters: { list: [] },
      query: '',
      page: 1,
      sortColumn: '',
      sortStatus: NO_SORT_STATUS,
      showEmptyState: false,
      loading: true
    };

    document.title = 'Accounts - Lily';
  }

  async componentDidMount() {
    const settingsResponse = await this.settings.get();
    const statusResponse = await Account.statuses();
    const statuses = statusResponse.results.map(status => {
      status.value = `status.id: ${status.id}`;
      return status;
    });
    const existsResponse = await Account.exists();
    const showEmptyState = !existsResponse.exists;

    await this.loadItems();

    this.setState({
      ...settingsResponse.results,
      statuses,
      showEmptyState
    });
  }

  setPage = async page => {
    this.setState({ page }, this.loadItems);
  };

  setSorting = async (sortColumn, sortStatus) => {
    await this.settings.store({ sortColumn, sortStatus });
    this.setState({ sortColumn, sortStatus }, this.loadItems);
  };

  setFilters = async filters => {
    await this.settings.store({ filters });
    this.setState({ filters }, this.loadItems);
  };

  toggleColumn = async index => {
    const { columns } = this.state;

    columns[index].selected = !columns[index].selected;

    await this.settings.store({ columns });
    this.setState({ columns });
  };

  handleSearch = query => {
    this.setState({ query }, this.debouncedSearch);
  };

  loadItems = async () => {
    const { page, sortColumn, sortStatus, query } = this.state;

    this.setState({ loading: true });

    const data = await Account.query({
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

  removeItem = ({ id }) => {
    const { items } = this.state;

    const index = items.findIndex(item => item.id === id);
    items.splice(index, 1);

    this.setState({ items });
  };

  export = () => {
    const columns = this.state.columns.filter(column => column.selected).map(column => column.key);
    Account.export({ columns });
  };

  render() {
    const {
      columns,
      items,
      statuses,
      filters,
      pagination,
      query,
      loading,
      page,
      sortColumn,
      sortStatus
    } = this.state;
    const { t } = this.props;

    return (
      <BlockUI blocking={loading}>
        <div className="list">
          <div className="list-header">
            <ColumnDisplay columns={columns} toggleColumn={this.toggleColumn} />

            <button className="hl-primary-btn" onClick={this.export}>
              Export accounts
            </button>

            <ListFilter
              label="Account status"
              items={statuses}
              filters={filters}
              setFilters={this.setFilters}
            />

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
              {items.map(account => (
                <tr key={account.id}>
                  {columns[0].selected && <td>{account.customerId}</td>}
                  {columns[1].selected && (
                    <td>
                      <Link to={`/accounts/${account.id}`}>{account.name}</Link>
                    </td>
                  )}
                  {columns[2].selected && (
                    <td>
                      {account.emailAddresses.map(emailAddress => (
                        <div key={emailAddress.id}>
                          {emailAddress.status !== 0 ? (
                            <Link to={`/email/compose/${emailAddress.emailAddress}`}>
                              <i className="lilicon hl-email-icon" /> {emailAddress.emailAddress}
                            </Link>
                          ) : null}
                        </div>
                      ))}
                      {account.phoneNumbers.map(phone => (
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
                    </td>
                  )}
                  {columns[3].selected && (
                    <td>
                      <Editable async type="select" field="assignedTo" object={account} />
                    </td>
                  )}
                  {columns[4].selected && (
                    <td>
                      <LilyDate date={account.created} />
                    </td>
                  )}
                  {columns[5].selected && (
                    <td>
                      <LilyDate date={account.modified} />
                    </td>
                  )}
                  {columns[6].selected && <td>{account.status.name}</td>}
                  {columns[7].selected && (
                    <td>
                      {account.tags.map(tag => (
                        <div key={tag.id}>{tag.name}</div>
                      ))}
                    </td>
                  )}
                  <td>
                    <ListActions item={account} deleteCallback={this.removeItem} {...this.props} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {this.state.showEmptyState && (
            <div className="empty-state-description">
              <h3>{t('accounts.emptyStateTitle')}</h3>

              <p>{t('accounts.line1')}</p>
              <p>{t('accounts.line2')}</p>
              <p>{t('accounts.line3')}</p>
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

export default withNamespaces('emptyStates')(AccountList);
