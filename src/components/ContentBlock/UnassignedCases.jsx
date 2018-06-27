import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import Case from 'models/Case';
import Editable from 'components/Editable';
import ContentBlock from 'components/ContentBlock';
import LilyDate from 'components/Utils/LilyDate';

class UnassignedCases extends Component {
  constructor(props) {
    super(props);

    this.state = { items: [] };
  }

  componentDidMount = async () => {
    await this.getItems();
  };

  getItems = async () => {
    const request = await Case.query();

    const total = request.results.length;
    const criticalCount = request.results.filter(item => item.priority === Case.CRITICAL_PRIORITY)
      .length;
    const items = request.results;

    this.setState({ items, total, criticalCount });
  };

  render() {
    const { items, total, criticalCount } = this.state;

    const title = (
      <React.Fragment>
        <div className="content-block-label cases" />
        <div className="content-block-name">
          <i className="lilicon hl-case-icon m-r-5" />
          Unassigned cases
          <span className="label-amount">{total || '-'}</span>
          <span className="label-amount high-prio">{criticalCount || '-'}</span>
        </div>
      </React.Fragment>
    );

    return (
      <ContentBlock title={title} component="unassignedCases" expandable closeable>
        <table className="hl-table">
          <thead>
            <tr>
              <th>Nr.</th>
              <th>Subject</th>
              <th>Client</th>
              <th>Priority</th>
              <th>Teams</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  <NavLink to={`/cases/${item.id}`}>{item.subject}</NavLink>
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
                  <Editable
                    type="select"
                    object={item}
                    field="priority"
                    submitCallback={this.submitCallback}
                    icon
                    hideValue
                  />
                </td>
                <td>{item.assignedToTeams.map(team => <div key={team.id}>{team.name}</div>)}</td>
                <td>
                  <LilyDate date={item.created} />
                </td>
                <td>
                  <button className="hl-primary-btn">Assign to me</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ContentBlock>
    );
  }
}

export default UnassignedCases;
