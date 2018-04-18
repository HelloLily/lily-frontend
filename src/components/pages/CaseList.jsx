import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import List from 'components/List';
import ListActions from 'components/List/ListActions';
import Case from 'src/models/Case';

class CaseList extends Component {
  constructor(props) {
    super(props);

    this.state = { cases: [] };
  }

  async componentDidMount() {
    const data = await Case.query();

    this.setState({ cases: data.results });
  }

  render() {
    const { cases } = this.state;

    return (
      <div>
        <List>
          <div className="widget-header">
            <h1>
              Case list
            </h1>
          </div>
          <table className="hl-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Subject</th>
                <th>Client</th>
                <th>Type</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Created</th>
                <th>Expires</th>
                <th>Assigned to</th>
                <th>Created by</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cases.map(caseObj => (
                <tr key={caseObj.id}>
                  <td>{caseObj.id}</td>
                  <td><NavLink to={`/cases/${caseObj.id}`}>{caseObj.subject}</NavLink></td>
                  <td>
                    {caseObj.contact &&
                      <NavLink to={`/contacts/${caseObj.contact.id}`}>{caseObj.contact.fullName}</NavLink>
                    }
                    {(caseObj.contact && caseObj.account) && <span>at</span> }
                    {caseObj.account &&
                      <NavLink to={`/accounts/${caseObj.account.id}`}>{caseObj.account.name}</NavLink>
                    }
                  </td>
                  <td>{caseObj.type.name}</td>
                  <td>{caseObj.status.name}</td>
                  <td><i className={`lilicon hl-prio-icon-${caseObj.priorityDisplay.toLowerCase()}`} /></td>
                  <td>{caseObj.created}</td>
                  <td>{caseObj.expires}</td>
                  <td>{caseObj.assignedTo ? caseObj.assignedTo.fullName : ''}</td>
                  <td>{caseObj.createdBy ? caseObj.createdBy.fullName : 'Unknown'}</td>
                  <td>{caseObj.tags.toString()}</td>
                  <td><ListActions /></td>
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

export default CaseList;
