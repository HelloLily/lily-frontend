import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import List from 'components/List';
import ColumnDisplay from 'components/List/ColumnDisplay';
import ListActions from 'components/List/ListActions';
import LilyPagination from 'components/LilyPagination';
import BlockUI from 'components/Utils/BlockUI';
import LilyDate from 'components/Utils/LilyDate';
import Settings from 'models/Settings';
import Deal from 'models/Deal';

class DealList extends Component {
  constructor(props) {
    super(props);

    this.settings = new Settings('dealList');

    const columns = [
      { key: 'name', text: 'Subject', selected: true },
      { key: 'client', text: 'Client', selected: true },
      { key: 'status', text: 'Status', selected: true },
      { key: 'lostReason', text: 'Lost reason', selected: false },
      { key: 'nextStep', text: 'Next step', selected: false },
      { key: 'nextStepDate', text: 'Next step date', selected: true },
      { key: 'assignedTo', text: 'Assigned to', selected: true },
      { key: 'assignedTeams', text: 'Assigned team(s)', selected: true },
      { key: 'amountOnce', text: 'One-time cost', selected: true },
      { key: 'amountRecurring', text: 'Recurring costs', selected: true },
      { key: 'newBusiness', text: 'Business', selected: true },
      { key: 'created', text: 'Created', selected: true },
      { key: 'closedDate', text: 'Closed date', selected: false },
      { key: 'createdBy', text: 'Created by', selected: true },
      { key: 'tags', text: 'Tags', selected: true }
    ];

    this.state = {
      columns,
      deals: [],
      pagination: {},
      loading: true
    };
  }

  async componentDidMount() {
    const settingsResponse = await this.settings.get();
    const data = await Deal.query({ pageSize: 20 });

    this.setState({
      ...settingsResponse.results,
      deals: data.results,
      pagination: data.pagination,
      loading: false
    });
  }

  setPage = async page => {
    this.setState({ loading: true });

    const data = await Deal.query({ pageSize: 20, page });

    this.setState({
      deals: data.results,
      pagination: data.pagination,
      loading: false
    });
  };

  toggleColumn = index => {
    const { columns } = this.state;

    columns[index].selected = !columns[index].selected;

    this.settings.store({ columns }).then(() => {
      this.setState({ columns });
    });
  };

  render() {
    const { columns, deals = [], loading, pagination } = this.state;

    return (
      <BlockUI blocking={loading}>
        <List>
          <div className="list-header">
            <ColumnDisplay columns={columns} toggleColumn={this.toggleColumn} />
          </div>
          <table className="hl-table">
            <thead>
              <tr>
                {columns[0].selected && <th>Subject</th>}
                {columns[1].selected && <th>Client</th>}
                {columns[2].selected && <th>Status</th>}
                {columns[3].selected && <th>Lost reason</th>}
                {columns[4].selected && <th>Next step</th>}
                {columns[5].selected && <th>Next step date</th>}
                {columns[6].selected && <th>Assigned to</th>}
                {columns[7].selected && <th>Assigned team(s)</th>}
                {columns[8].selected && <th>One-time cost</th>}
                {columns[9].selected && <th>Recurring costs</th>}
                {columns[10].selected && <th>Business</th>}
                {columns[11].selected && <th>Created</th>}
                {columns[12].selected && <th>Closed date</th>}
                {columns[13].selected && <th>Created by</th>}
                {columns[14].selected && <th>Tags</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deals.map(deal => (
                <tr key={deal.id}>
                  {columns[0].selected && (
                    <td>
                      <Link to={`/deals/${deal.id}`}>{deal.name}</Link>
                    </td>
                  )}
                  {columns[1].selected && (
                    <td>
                      {deal.contact && (
                        <Link to={`/contacts/${deal.contact.id}`}>{deal.contact.fullName}</Link>
                      )}
                      {deal.contact && deal.account && ' at '}
                      {deal.account && (
                        <Link to={`/accounts/${deal.account.id}`}>{deal.account.name}</Link>
                      )}
                    </td>
                  )}
                  {columns[2].selected && <td>{deal.status.name}</td>}
                  {columns[3].selected && <td>{deal.whyLost && deal.whyLost.name}</td>}
                  {columns[4].selected && (
                    <td>
                      <i
                        className={`lilicon hl-prio-icon-${deal.nextStep.name.toLowerCase()} m-r-5`}
                      />
                      {deal.nextStep.name}
                    </td>
                  )}
                  {columns[5].selected && (
                    <td>
                      <LilyDate date={deal.nextStepDate} />
                    </td>
                  )}
                  {columns[6].selected && (
                    <td>{deal.assignedTo ? deal.assignedTo.fullName : ''}</td>
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
                    <ListActions object={deal} {...this.props} />
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

export default DealList;
