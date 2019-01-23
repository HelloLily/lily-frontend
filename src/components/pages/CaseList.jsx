import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import debounce from 'debounce-promise';

import { DESCENDING_STATUS, DEBOUNCE_WAIT } from 'lib/constants';
import withContext from 'src/withContext';
import timeCategorize from 'utils/timeCategorize';
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

    this.mounted = false;
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
      { key: 'assignedTo', text: 'Assigned to', selected: true, sort: 'assignedTo.firstName' },
      { key: 'assignedToTeams', text: 'Assigned to teams', selected: true },
      { key: 'createdBy', text: 'Created by', selected: true, sort: 'createdBy.firstName' },
      { key: 'tags', text: 'Tags', selected: true }
    ];

    this.state = {
      columns,
      items: [],
      caseTypes: [],
      caseStatuses: [],
      filters: { list: [], status: [], dueDate: [], user: [] },
      query: '',
      pagination: {},
      page: 1,
      sortColumn: 'expires',
      sortStatus: DESCENDING_STATUS,
      showEmptyState: false,
      splitView: false,
      loading: true
    };

    document.title = 'Cases - Lily';
  }

  async componentDidMount() {
    this.mounted = true;

    const settingsResponse = await this.settings.get();
    const existsResponse = await Case.exists();
    const showEmptyState = !existsResponse.exists;
    const caseTypeResponse = await Case.caseTypes();
    const caseTypes = caseTypeResponse.results.map(caseType => {
      caseType.value = `type.id=${caseType.id}`;

      return caseType;
    });
    const caseStatusResponse = await Case.statuses();
    const caseStatuses = caseStatusResponse.results.map(status => {
      status.value = `status.id=${status.id}`;

      return status;
    });

    if (this.mounted) {
      this.setState(
        {
          ...settingsResponse.results,
          caseTypes,
          caseStatuses,
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

  setFilters = async (newFilters, type) => {
    const { filters } = this.state;

    filters[type] = newFilters;

    await this.setState({ filters });
    await this.settings.store({ filters });

    this.loadItems();
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
    const { query, page, sortColumn, sortStatus, splitView, filters } = this.state;
    const { currentUser } = this.props;

    this.setState({ loading: true });

    const data = await Case.query({
      search: query,
      pageSize: 20,
      page,
      sortColumn,
      sortStatus,
      filters
    });

    if (this.mounted) {
      const { results } = data;
      const items = splitView ? timeCategorize(results, 'expires', currentUser) : results;

      this.setState({
        items,
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

  createTableRow = (items, newlyAssigned = false) => {
    const { columns } = this.state;

    const row = (
      <React.Fragment>
        {items.map(item => (
          <tr key={item.id} className={newlyAssigned ? 'newly-assigned' : ''}>
            {columns[0].selected && <td>{item.id}</td>}
            {columns[1].selected && (
              <td>
                <Link to={`/cases/${item.id}`}>{item.subject}</Link>
              </td>
            )}
            {columns[2].selected && (
              <td>
                <ClientDisplay contact={item.contact} account={item.account} />
              </td>
            )}
            {columns[3].selected && (
              <td>
                <Editable type="select" field="type" object={item} />
              </td>
            )}
            {columns[4].selected && (
              <td>
                <Editable type="select" field="status" object={item} />
              </td>
            )}
            {columns[5].selected && (
              <td>
                <Editable icon hideValue type="select" object={item} field="priority" />
              </td>
            )}
            {columns[6].selected && (
              <td>
                <LilyDate date={item.created} />
              </td>
            )}
            {columns[7].selected && (
              <td>
                <Postpone object={item} field="expires" />
              </td>
            )}
            {columns[8].selected && (
              <td>
                <LilyDate date={item.modified} />
              </td>
            )}
            {columns[9].selected && (
              <td>
                <Editable async type="select" field="assignedTo" object={item} />
              </td>
            )}
            {columns[10].selected && (
              <td>
                {item.assignedToTeams.map(team => (
                  <div key={team.id}>{team.name}</div>
                ))}
              </td>
            )}
            {columns[11].selected && (
              <td>{item.createdBy ? item.createdBy.fullName : 'Unknown'}</td>
            )}
            {columns[12].selected && (
              <td>
                {item.tags.map(tag => (
                  <div key={tag.id}>{tag.name}</div>
                ))}
              </td>
            )}
            <td>
              <ListActions item={item} deleteCallback={this.removeItem} {...this.props} />
            </td>
          </tr>
        ))}
      </React.Fragment>
    );

    return row;
  };

  createTableContent = () => {
    const { items, splitView } = this.state;

    if (splitView) {
      const categories = [];

      Object.keys(items).forEach(key => {
        const newlyAssigned = key === 'newlyAssigned';

        const tbody = (
          <tbody key={key}>
            {items[key].length > 0 && (
              <tr className="table-category">
                {newlyAssigned ? (
                  <td colSpan="13">Newly assigned to you</td>
                ) : (
                  <td colSpan="13" className="text-capitalize">
                    {key}
                  </td>
                )}
              </tr>
            )}
            {this.createTableRow(items[key], newlyAssigned)}
          </tbody>
        );

        categories.push(tbody);
      });

      return categories;
    }

    return <tbody>{this.createTableRow(items)}</tbody>;
  };

  render() {
    const {
      columns,
      caseTypes,
      caseStatuses,
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
              filters={filters.list}
              setFilters={this.setFilters}
            />

            <ListFilter
              label="Case statuses"
              items={caseStatuses}
              filters={filters.status}
              type="status"
              setFilters={this.setFilters}
            />

            <div className="flex-grow" />

            <DueDateFilter filters={filters.dueDate} setFilters={this.setFilters} />

            <UserFilter filters={filters.user} setFilters={this.setFilters} />

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

            {this.createTableContent()}
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

export default withNamespaces('emptyStates')(withContext(CaseList));
