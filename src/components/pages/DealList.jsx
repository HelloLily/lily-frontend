import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';

import { NO_SORT_STATUS } from 'lib/constants';
import List from 'components/List';
import ColumnDisplay from 'components/List/ColumnDisplay';
import ListActions from 'components/List/ListActions';
import LilyPagination from 'components/LilyPagination';
import ListColumns from 'components/List/ListColumns';
import ListFilter from 'components/List/ListFilter';
import SearchBar from 'components/List/SearchBar';
import Editable from 'components/Editable';
import DueDateFilter from 'components/DueDateFilter';
import BlockUI from 'components/Utils/BlockUI';
import LilyDate from 'components/Utils/LilyDate';
import Postpone from 'components/Postpone';
import ClientDisplay from 'components/Utils/ClientDisplay';
import Settings from 'models/Settings';
import Deal from 'models/Deal';

class DealList extends Component {
  constructor(props) {
    super(props);

    this.settings = new Settings('dealList');

    const columns = [
      { key: 'name', text: 'Subject', selected: true },
      { key: 'client', text: 'Client', selected: true },
      { key: 'status', text: 'Status', selected: true, sort: 'status.name' },
      { key: 'lostReason', text: 'Lost reason', selected: false, sort: 'whyLost' },
      { key: 'nextStep', text: 'Next step', selected: false, sort: 'nextStep.name' },
      { key: 'nextStepDate', text: 'Next step date', selected: true, sort: 'nextStepDate' },
      { key: 'assignedTo', text: 'Assigned to', selected: true, sort: 'assignedTo.fullName' },
      { key: 'assignedTeams', text: 'Assigned team(s)', selected: true },
      { key: 'amountOnce', text: 'One-time cost', selected: true, sort: 'amountOnce' },
      { key: 'amountRecurring', text: 'Recurring costs', selected: true, sort: 'amountRecurring' },
      { key: 'newBusiness', text: 'Business', selected: true, sort: 'newBusiness' },
      { key: 'created', text: 'Created', selected: true, sort: 'created' },
      { key: 'closedDate', text: 'Closed date', selected: false, sort: 'closedDate' },
      { key: 'createdBy', text: 'Created by', selected: true, sort: 'createdBy.fullName' },
      { key: 'tags', text: 'Tags', selected: true }
    ];

    this.state = {
      columns,
      items: [],
      nextSteps: [],
      filters: { list: [], dueDate: [], user: [] },
      query: '',
      pagination: {},
      page: 1,
      sortColumn: '',
      sortStatus: NO_SORT_STATUS,
      showEmptyState: false,
      loading: true
    };

    document.title = 'Deals - Lily';
  }

  async componentDidMount() {
    const settingsResponse = await this.settings.get();
    const existsResponse = await Deal.exists();
    const showEmptyState = !existsResponse.exists;
    const nextStepResponse = await Deal.nextSteps();
    const nextSteps = nextStepResponse.results.map(nextStep => {
      nextStep.value = `nextStep.id: ${nextStep.id}`;

      return nextStep;
    });

    await this.loadItems();

    this.setState({
      ...settingsResponse.results,
      nextSteps,
      showEmptyState,
      loading: false
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

    const data = await Deal.query({
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
    const {
      columns,
      items,
      nextSteps,
      filters,
      query,
      loading,
      pagination,
      sortColumn,
      sortStatus
    } = this.state;
    const { t } = this.props;

    return (
      <BlockUI blocking={loading}>
        <List>
          <div className="list-header">
            <ColumnDisplay columns={columns} toggleColumn={this.toggleColumn} />

            <ListFilter
              label="Next steps"
              items={nextSteps}
              filters={filters}
              setFilters={this.setFilters}
            />

            <div className="flex-grow" />

            <DueDateFilter filters={filters} setFilters={this.setFilters} />

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
              {items.map(deal => (
                <tr key={deal.id}>
                  {columns[0].selected && (
                    <td>
                      <Link to={`/deals/${deal.id}`}>{deal.name}</Link>
                    </td>
                  )}
                  {columns[1].selected && (
                    <td>
                      <ClientDisplay contact={deal.contact} account={deal.account} />
                    </td>
                  )}
                  {columns[2].selected && <td>{deal.status.name}</td>}
                  {columns[3].selected && <td>{deal.whyLost && deal.whyLost.name}</td>}
                  {columns[4].selected && (
                    <td>
                      <Editable icon type="select" field="nextStep" object={deal} />
                    </td>
                  )}
                  {columns[5].selected && (
                    <td>
                      <Postpone object={deal} field="nextStepDate" />
                    </td>
                  )}
                  {columns[6].selected && (
                    <td>
                      <Editable async type="select" field="assignedTo" object={deal} />
                    </td>
                  )}
                  {columns[7].selected && (
                    <td>
                      {deal.assignedToTeams.map(team => (
                        <div key={team.id}>{team.name}</div>
                      ))}
                    </td>
                  )}
                  {columns[8].selected && <td>{deal.amountOnce}</td>}
                  {columns[9].selected && <td>{deal.amountRecurring}</td>}
                  {columns[10].selected && <td>{deal.newBusiness ? 'New' : 'Existing'}</td>}
                  {columns[11].selected && (
                    <td>
                      <LilyDate date={deal.created} />
                    </td>
                  )}
                  {columns[12].selected && <td>{deal.closedDate}</td>}
                  {columns[13].selected && (
                    <td>{deal.createdBy ? deal.createdBy.fullName : 'Unknown'}</td>
                  )}
                  {columns[14].selected && (
                    <td>
                      {deal.tags.map(tag => (
                        <div key={tag.id}>{tag.name}</div>
                      ))}
                    </td>
                  )}
                  <td>
                    <ListActions item={deal} deleteCallback={this.removeItem} {...this.props} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {this.state.showEmptyState && (
            <div className="empty-state-description">
              <h3>{t('deals.emptyStateTitle')}</h3>

              <p>{t('deals.line1')}</p>
              <p>{t('deals.line2')}</p>
              <p>{t('deals.line3')}</p>
            </div>
          )}

          <div className="list-footer">
            <LilyPagination setPage={this.setPage} pagination={pagination} page={this.state.page} />
          </div>
        </List>
      </BlockUI>
    );
  }
}

export default withNamespaces('emptyStates')(DealList);
