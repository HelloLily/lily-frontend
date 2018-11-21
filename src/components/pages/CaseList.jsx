import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { debounce } from 'debounce';

import { DESCENDING_STATUS, DEBOUNCE_WAIT } from 'lib/constants';
import Editable from 'components/Editable';
import ColumnDisplay from 'components/List/ColumnDisplay';
import ListActions from 'components/List/ListActions';
import LilyPagination from 'components/LilyPagination';
import LilyDate from 'components/Utils/LilyDate';
import Postpone from 'components/Postpone';
import ListColumns from 'components/List/ListColumns';
import ListFilter from 'components/List/ListFilter';
import SearchBar from 'components/List/SearchBar';
import DueDateFilter from 'components/DueDateFilter';
import BlockUI from 'components/Utils/BlockUI';
import ClientDisplay from 'components/Utils/ClientDisplay';
import UserFilter from 'components/UserFilter';
import Settings from 'models/Settings';
import Case from 'models/Case';

class CaseList extends Component {
  constructor(props) {
    super(props);

    this.settings = new Settings('caseList');
    this.debouncedSearch = debounce(this.loadItems, DEBOUNCE_WAIT);

    const columns = [
      { key: 'caseId', text: 'NO.', selected: true, sort: 'id' },
      { key: 'subject', text: 'Subject', selected: true },
      { key: 'client', text: 'Client', selected: true },
      { key: 'type', text: 'Type', selected: true, sort: 'type.name' },
      { key: 'status', text: 'Status', selected: true, sort: 'status.name' },
      { key: 'priority', text: 'Priority', selected: true, sort: 'priority' },
      { key: 'created', text: 'Created', selected: true, sort: 'created' },
      { key: 'expires', text: 'Expires', selected: true, sort: 'expires' },
      { key: 'modified', text: 'Modified', selected: false, sort: 'modified' },
      { key: 'assignedTo', text: 'Assigned to', selected: true, sort: 'assignedTo.fullName' },
      { key: 'assignedToTeams', text: 'Assigned to teams', selected: true },
      { key: 'createdBy', text: 'Created by', selected: true, sort: 'createdBy.fullName' },
      { key: 'tags', text: 'Tags', selected: true }
    ];

    this.state = {
      columns,
      items: [],
      caseTypes: [],
      filters: { list: [], dueDate: [], user: [] },
      query: '',
      pagination: {},
      page: 1,
      sortColumn: 'expires',
      sortStatus: DESCENDING_STATUS,
      showEmptyState: false,
      loading: true
    };

    document.title = 'Cases - Lily';
  }

  async componentDidMount() {
    const settingsResponse = await this.settings.get();
    const existsResponse = await Case.exists();
    const showEmptyState = !existsResponse.exists;
    const caseTypeResponse = await Case.caseTypes();
    const caseTypes = caseTypeResponse.results.map(caseType => {
      caseType.value = `type.id=${caseType.id}`;

      return caseType;
    });

    this.setState(
      {
        ...settingsResponse.results,
        caseTypes,
        page: 1,
        showEmptyState
      },
      this.loadItems
    );
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
    const { query, page, sortColumn, sortStatus, filters } = this.state;

    this.setState({ loading: true });

    const data = await Case.query({
      search: query,
      pageSize: 20,
      page,
      sortColumn,
      sortStatus,
      filters
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

  render() {
    const {
      columns,
      items,
      caseTypes,
      filters,
      query,
      pagination,
      page,
      sortColumn,
      sortStatus,
      showEmptyState,
      loading
    } = this.state;
    const { t } = this.props;

    return (
      <BlockUI blocking={loading}>
        <div className="list">
          <div className="list-header">
            <ColumnDisplay columns={columns} toggleColumn={this.toggleColumn} />

            <ListFilter
              label="Case types"
              items={caseTypes}
              filters={filters}
              setFilters={this.setFilters}
            />

            <div className="flex-grow" />

            <DueDateFilter filters={filters} setFilters={this.setFilters} />

            <UserFilter filters={filters} setFilters={this.setFilters} />

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
              {items.map(caseObj => (
                <tr key={caseObj.id}>
                  {columns[0].selected && <td>{caseObj.id}</td>}
                  {columns[1].selected && (
                    <td>
                      <Link to={`/cases/${caseObj.id}`}>{caseObj.subject}</Link>
                    </td>
                  )}
                  {columns[2].selected && (
                    <td>
                      <ClientDisplay contact={caseObj.contact} account={caseObj.account} />
                    </td>
                  )}
                  {columns[3].selected && (
                    <td>
                      <Editable type="select" field="type" object={caseObj} />
                    </td>
                  )}
                  {columns[4].selected && (
                    <td>
                      <Editable type="select" field="status" object={caseObj} />
                    </td>
                  )}
                  {columns[5].selected && (
                    <td>
                      <Editable icon hideValue type="select" object={caseObj} field="priority" />
                    </td>
                  )}
                  {columns[6].selected && (
                    <td>
                      <LilyDate date={caseObj.created} />
                    </td>
                  )}
                  {columns[7].selected && (
                    <td>
                      <Postpone object={caseObj} field="expires" />
                    </td>
                  )}
                  {columns[8].selected && (
                    <td>
                      <LilyDate date={caseObj.modified} />
                    </td>
                  )}
                  {columns[9].selected && (
                    <td>
                      <Editable async type="select" field="assignedTo" object={caseObj} />
                    </td>
                  )}
                  {columns[10].selected && (
                    <td>
                      {caseObj.assignedToTeams.map(team => (
                        <div key={team.id}>{team.name}</div>
                      ))}
                    </td>
                  )}
                  {columns[11].selected && (
                    <td>{caseObj.createdBy ? caseObj.createdBy.fullName : 'Unknown'}</td>
                  )}
                  {columns[12].selected && (
                    <td>
                      {caseObj.tags.map(tag => (
                        <div key={tag.id}>{tag.name}</div>
                      ))}
                    </td>
                  )}
                  <td>
                    <ListActions item={caseObj} deleteCallback={this.removeItem} {...this.props} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showEmptyState && (
            <div className="empty-state-description">
              <h3>{t('cases.emptyStateTitle')}</h3>

              <p>{t('cases.line1')}</p>
              <p>{t('cases.line2')}</p>
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

export default withNamespaces('emptyStates')(CaseList);
