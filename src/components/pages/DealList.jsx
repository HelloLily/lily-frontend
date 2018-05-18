import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import List from 'components/List';
import ListActions from 'components/List/ListActions';
import LilyPagination from 'components/LilyPagination';
import BlockUI from 'components/Utils/BlockUI';
import LilyDate from 'components/Utils/LilyDate';
import Deal from 'models/Deal';

class DealList extends Component {
  constructor(props) {
    super(props);

    this.state = { deals: [], pagination: {}, loading: true };
  }

  async componentDidMount() {
    const data = await Deal.query({ pageSize: 20 });

    this.setState({
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

  render() {
    const { deals, loading, pagination } = this.state;

    return (
      <BlockUI blocking={loading}>
        <List>
          <div className="list-header">
            <h1>Deal list</h1>
          </div>
          <table className="hl-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Client</th>
                <th>Status</th>
                <th>Next step</th>
                <th>Next step date</th>
                <th>Assigned to</th>
                <th>One-time cost</th>
                <th>Recurring costs</th>
                <th>Business</th>
                <th>Created</th>
                <th>Created by</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deals.map(deal => (
                <tr key={deal.id}>
                  <td>
                    <NavLink to={`/deals/${deal.id}`}>{deal.name}</NavLink>
                  </td>
                  <td>
                    {deal.contact && (
                      <NavLink to={`/contacts/${deal.contact.id}`}>{deal.contact.fullName}</NavLink>
                    )}
                    {deal.contact && deal.account && ' at '}
                    {deal.account && (
                      <NavLink to={`/accounts/${deal.account.id}`}>{deal.account.name}</NavLink>
                    )}
                  </td>
                  <td>{deal.status.name}</td>
                  <td>
                    <i className={`lilicon hl-prio-icon-${deal.nextStep.name.toLowerCase()}`} />{' '}
                    {deal.nextStep.name}
                  </td>
                  <td>
                    <LilyDate date={deal.nextStepDate} />
                  </td>
                  <td>{deal.assignedTo ? deal.assignedTo.fullName : ''}</td>
                  <td>{deal.amountOnce}</td>
                  <td>{deal.amountRecurring}</td>
                  <td>{deal.newBusiness ? 'New' : 'Existing'}</td>
                  <td>
                    <LilyDate date={deal.created} />
                  </td>
                  <td>{deal.createdBy ? deal.createdBy.fullName : 'Unknown'}</td>
                  <td>{deal.tags.map(tag => <div key={tag.id}>{tag.name}</div>)}</td>
                  <td>
                    <ListActions />
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
