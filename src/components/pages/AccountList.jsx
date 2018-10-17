import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { MOBILE_PHONE_TYPE, WORK_PHONE_TYPE, NO_SORT_STATUS } from 'lib/constants';
import List from 'components/List';
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
      accounts: [],
      pagination: {},
      statuses: [],
      filters: { list: [] },
      query: '',
      loading: true,
      page: 1,
      sortColumn: '',
      sortStatus: NO_SORT_STATUS
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
    await this.loadItems();

    this.setState({
      ...settingsResponse.results,
      statuses,
      loading: false
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

  handleSearch = event => {
    this.setState({ query: event.target.value }, this.loadItems);
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
      accounts: data.results,
      pagination: data.pagination,
      loading: false
    });
  };

  export = () => {
    console.log('Exported accounts');
  };

  render() {
    const {
      columns,
      accounts,
      statuses,
      filters,
      pagination,
      query,
      loading,
      sortColumn,
      sortStatus
    } = this.state;

    return (
      <BlockUI blocking={loading}>
        <List>
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
              {accounts.map(account => (
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
                    <ListActions object={account} {...this.props} />
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

export default AccountList;
