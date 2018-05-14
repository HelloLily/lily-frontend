import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import Deal from 'models/Deal';
import Editable from 'components/Editable';
import Widget from 'components/Widget';
import LilyDate from 'components/utils/LilyDate';

class UnassignedDeals extends Component {
  constructor(props) {
    super(props);

    this.state = { items: [] };
  }

  componentDidMount = async () => {
    await this.getItems();
  };

  getItems = async () => {
    const request = await Deal.query();

    const total = request.results.length;
    const items = request.results;

    this.setState({ items, total });
  };

  render() {
    const { items, total } = this.state;

    const title = (
      <React.Fragment>
        <div className="widget-label deals" />
        <div className="widget-name">
          <i className="lilicon hl-deals-icon m-r-5" />
          Unassigned deals
          <span className="label-amount">{total || '-'}</span>
        </div>
      </React.Fragment>
    );

    return (
      <Widget title={title} component="unassignedDeals" expandable>
        <table className="hl-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Client</th>
              <th>Deal size</th>
              <th>Teams</th>
              <th>Next step</th>
              <th>Next step date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>
                  <NavLink to={`/deals/${item.id}`}>{item.name}</NavLink>
                </td>
                <td>
                  {item.contact && (
                    <NavLink to={`/contacts/${item.contact.id}`}>{item.contact.fullName}</NavLink>
                  )}
                  {item.contact && item.account && <span> at </span>}
                  {item.account && (
                    <NavLink to={`/accounts/${item.account.id}`}>{item.account.name}</NavLink>
                  )}
                </td>
                <td>
                  {item.amountOnce !== 0 && <span>{item.amountOnce} /month</span>}
                  {item.amountOnce !== 0 && item.amountRecurring !== 0 && <span> | </span>}
                  {item.amountRecurring !== 0 && <span>{item.amountRecurring} /once</span>}
                </td>
                <td>{item.assignedToTeams.map(team => <div key={team.id}>{team.name}</div>)}</td>
                <td>
                  <Editable
                    type="select"
                    object={item}
                    field="nextStep"
                    submitCallback={this.submitCallback}
                    icon
                  />
                </td>
                <td>
                  <LilyDate date={item.nextStepDate} />
                </td>
                <td>
                  <button className="hl-primary-btn">Assign to me</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Widget>
    );
  }
}

export default UnassignedDeals;
