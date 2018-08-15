import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { MOBILE_PHONE_TYPE, WORK_PHONE_TYPE } from 'lib/constants';
import List from 'components/List';
import ColumnDisplay from 'components/List/ColumnDisplay';
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
            <ColumnDisplay />

            <button className="hl-primary-btn m-l-10 m-r-10" onClick={this.export}>
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
                    <Link to={`/accounts/${account.id}`}>{account.name}</Link>
                  </td>
                  <td>
                    {account.emailAddresses.map(emailAddress => (
                      <div key={emailAddress.id}>
                        {emailAddress.status !== 0 ? (
                          <Link to={`/email/compose/${emailAddress.emailAddress}`}>
                            <i className="lilicon hl-email-icon" /> {emailAddress.emailAddress}
                          </Link>
                        ) : null}
                      </div>
                    ))}
                    {account.phoneNumbers.map(phone => (
                      <div key={phone.id}>
                        {phone.type === MOBILE_PHONE_TYPE || phone.type === WORK_PHONE_TYPE ? (
                          <a href={`tel:${phone.number}`}>
                            {phone.type === MOBILE_PHONE_TYPE ? (
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
                  <td>
                    {account.tags.map(tag => (
                      <div key={tag.id}>{tag.name}</div>
                    ))}
                  </td>
                  <td>
                    <ListActions object={account} {...this.props} />
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
