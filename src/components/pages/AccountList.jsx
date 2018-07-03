import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import List from 'components/List';
import ListActions from 'components/List/ListActions';
import Editable from 'components/Editable';
import LilyPagination from 'components/LilyPagination';
import LilyDate from 'components/Utils/LilyDate';
import ListFilter from 'components/List/ListFilter';
import BlockUI from 'components/Utils/BlockUI';
import Account from 'models/Account';

class AccountList extends Component {
  constructor(props) {
    super(props);

    this.state = { accounts: [], pagination: {}, statuses: [], loading: true };
  }

  async componentDidMount() {
    const data = await Account.query({ pageSize: 20 });
    const statusRequest = await Account.statuses();

    this.setState({
      accounts: data.results,
      pagination: data.pagination,
      statuses: statusRequest.results,
      loading: false
    });
  }

  setPage = async page => {
    this.setState({ loading: true });

    const data = await Account.query({ pageSize: 20, page });

    this.setState({
      accounts: data.results,
      pagination: data.pagination,
      loading: false
    });
  };

  export = () => {
    console.log('Exported accounts');
  };

  render() {
    const { accounts, pagination, statuses, loading } = this.state;

    return (
      <BlockUI blocking={loading}>
        <List>
          <div className="list-header">
            {/* TODO: This should be some generic List thing. */}
            <button className="hl-primary-btn m-r-10">
              <FontAwesomeIcon icon="columns" />
              <span className="m-l-5 m-r-5">Columns</span>
              <i className="lilicon hl-toggle-down-icon small" />
            </button>

            <button className="hl-primary-btn m-r-10" onClick={this.export}>
              Export accounts
            </button>

            <ListFilter label="Account status" items={statuses} />
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
                  <td>
                    <NavLink to={`/accounts/${account.id}`}>{account.name}</NavLink>
                  </td>
                  <td>
                    {account.emailAddresses.map(emailAddress => (
                      <div key={emailAddress.id}>
                        {emailAddress.status !== 0 ? (
                          <NavLink to={`/email/compose/${emailAddress.emailAddress}`}>
                            <i className="lilicon hl-email-icon" /> {emailAddress.emailAddress}
                          </NavLink>
                        ) : null}
                      </div>
                    ))}
                    {account.phoneNumbers.map(phone => (
                      <div key={phone.id}>
                        {phone.type === 'mobile' || phone.type === 'work' ? (
                          <a href={`tel:${phone.number}`}>
                            {phone.type === 'mobile' ? (
                              <FontAwesomeIcon icon="mobile" />
                            ) : (
                              <i className="lilicon hl-phone-filled-icon" />
                            )}

                            <span className="m-l-5">{phone.number}</span>
                          </a>
                        ) : null}
                      </div>
                    ))}
                  </td>
                  <td>
                    <Editable type="select" object={account} field="assignedTo" />
                  </td>
                  <td>
                    <LilyDate date={account.created} />
                  </td>
                  <td>
                    <LilyDate date={account.modified} />
                  </td>
                  <td>{account.status.name}</td>
                  <td>{account.tags.map(tag => <div key={tag.id}>{tag.name}</div>)}</td>
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

export default AccountList;
