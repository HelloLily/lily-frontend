import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import Account from 'src/models/Account';
import List from 'components/List';
import ListActions from 'components/List/ListActions';
import Editable from 'components/Editable';

class AccountList extends Component {
  constructor(props) {
    super(props);

    this.state = { accounts: [] };
  }

  async componentDidMount() {
    const data = await Account.query();

    this.setState({ accounts: data.results });
  }

  render() {
    const { accounts } = this.state;

    return (
      <div>
        <List>
          <div className="widget-header">
            <h1>
              Account list
            </h1>
          </div>
          <table className="hl-table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Contact information</th>
                <th>Assigned to</th>
                <th>Created</th>
                <th>Modified</th>
                <th>Status</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(account => (
                <tr key={account.id}>
                  <td><NavLink to={`/accounts/${account.id}`}>{account.name}</NavLink></td>
                  <td>{account.emailAddresses.toString()}</td>
                  <td>
                    <Editable type="select" object={account} field="assignedTo" />
                  </td>
                  <td>{account.created}</td>
                  <td>{account.modified}</td>
                  <td>{account.status.name}</td>
                  <td>{account.tags}</td>
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

export default AccountList;
