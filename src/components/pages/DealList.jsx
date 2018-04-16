import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import List from 'components/List';
import Deal from 'src/models/Deal';

class DealList extends Component {
  constructor(props) {
    super(props);

    this.state = { deals: [] };
  }

  async componentDidMount() {
    const data = await Deal.query();

    this.setState({ deals: data.results });
  }

  render() {
    const { deals } = this.state;

    return (
      <div>
        <List>
          <div className="widget-header">
            <h1>
              Deal list
            </h1>
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
                  <td><NavLink to={`/deals/${deal.id}`}>{deal.name}</NavLink></td>
                  <td>
                    {deal.contact &&
                      <NavLink to={`/contacts/${deal.contact.id}`}>{deal.contact.fullName}</NavLink>
                    }
                    {(deal.contact && deal.account) && " at " }
                    {deal.account &&
                      <NavLink to={`/accounts/${deal.account.id}`}>{deal.account.name}</NavLink>
                    }
                  </td>
                  <td>{deal.status.name}</td>
                  <td><i className={`lilicon hl-prio-icon-${deal.nextStep.name.toLowerCase()}`}></i> {deal.nextStep.name}</td>
                  <td>{deal.nextStepDate}</td>
                  <td>{deal.assignedTo ? deal.assignedTo.fullName : ''}</td>
                  <td>{deal.amountOnce}</td>
                  <td>{deal.amountRecurring}</td>
                  <td>{deal.newBusiness ? "New" : "Existing"}</td>
                  <td>{deal.created}</td>
                  <td>{deal.createdBy ? deal.createdBy.fullName : 'Unknown'}</td>
                  <td>{deal.tags.toString()}</td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="widget-footer">
            Pagination
          </div>
        </List>
      </div>
    );
  }
}

export default DealList;
