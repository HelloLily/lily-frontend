import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { NO_SORT_STATUS } from 'lib/constants';
import Editable from 'components/Editable';
import List from 'components/List';
import ColumnDisplay from 'components/List/ColumnDisplay';
import ListActions from 'components/List/ListActions';
import LilyPagination from 'components/LilyPagination';
import LilyDate from 'components/Utils/LilyDate';
import ListColumns from 'components/List/ListColumns';
import ListFilter from 'components/List/ListFilter';
import DueDateFilter from 'components/DueDateFilter';
import BlockUI from 'components/Utils/BlockUI';
import Settings from 'models/Settings';
import Case from 'models/Case';
import UserFilter from 'src/components/UserFilter/index';

class CaseList extends Component {
  constructor(props) {
    super(props);

    this.settings = new Settings('caseList');

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
      cases: [],
      caseTypes: [],
      filters: { list: [], dueDate: [], user: [] },
      pagination: {},
      loading: true
    };
  }

  async componentDidMount() {
    const settingsResponse = await this.settings.get();
    const caseTypeResponse = await Case.caseTypes();
    const caseTypes = caseTypeResponse.results.map(caseType => {
      caseType.value = `type.id: ${caseType.id}`;
      return caseType;
    });
    await this.loadItems();

    this.setState({
      ...settingsResponse.results,
      caseTypes,
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

  submitCallback = args => Case.patch(args);

  toggleColumn = async index => {
    const { columns } = this.state;

    columns[index].selected = !columns[index].selected;

    await this.settings.store({ columns });

    this.setState({ columns });
  };

  loadItems = async () => {
    const { page, sortColumn, sortStatus, filters } = this.state;

    this.setState({ loading: true });

    const filter = filters.list.join(' AND ');
    const data = await Case.query({
      pageSize: 20,
      page,
      sortColumn,
      sortStatus,
      filter
    });

    this.setState({
      cases: data.results,
      pagination: data.pagination,
      loading: false
    });
  };

  render() {
    const {
      columns,
      cases,
      caseTypes,
      filters,
      loading,
      pagination,
      sortColumn,
      sortStatus
    } = this.state;

    return (
      <BlockUI blocking={loading}>
        <List>
          <div className="list-header">
            <ColumnDisplay columns={columns} toggleColumn={this.toggleColumn} />

            <ListFilter
              label="Case types"
              items={caseTypes}
              filters={filters}
              setFilters={this.setFilters}
            />

            <DueDateFilter filters={filters} setFilters={this.setFilters} />

            <UserFilter filters={filters} setFilters={this.setFilters} />
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
              {cases.map(caseObj => (
                <tr key={caseObj.id}>
                  {columns[0].selected && <td>{caseObj.id}</td>}
                  {columns[1].selected && (
                    <td>
                      <Link to={`/cases/${caseObj.id}`}>{caseObj.subject}</Link>
                    </td>
                  )}
                  {columns[2].selected && (
                    <td>
                      {caseObj.contact && (
                        <Link to={`/contacts/${caseObj.contact.id}`}>
                          {caseObj.contact.fullName}
                        </Link>
                      )}
                      {caseObj.contact && caseObj.account && <span> at </span>}
                      {caseObj.account && (
                        <Link to={`/accounts/${caseObj.account.id}`}>{caseObj.account.name}</Link>
                      )}
                    </td>
                  )}
                  {columns[3].selected && <td>{caseObj.type.name}</td>}
                  {columns[4].selected && <td>{caseObj.status.name}</td>}
                  {columns[5].selected && (
                    <td>
                      <Editable
                        icon
                        hideValue
                        type="select"
                        object={caseObj}
                        field="priority"
                        submitCallback={this.submitCallback}
                      />
                    </td>
                  )}
                  {columns[6].selected && (
                    <td>
                      <LilyDate date={caseObj.created} />
                    </td>
                  )}
                  {columns[7].selected && (
                    <td>
                      <LilyDate date={caseObj.expires} />
                    </td>
                  )}
                  {columns[8].selected && (
                    <td>
                      <LilyDate date={caseObj.modified} />
                    </td>
                  )}
                  {columns[9].selected && (
                    <td>{caseObj.assignedTo ? caseObj.assignedTo.fullName : ''}</td>
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
                    <ListActions object={caseObj} {...this.props} />
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

export default CaseList;
