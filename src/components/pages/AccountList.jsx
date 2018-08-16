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
import Settings from 'models/Settings';
import Account from 'models/Account';

class AccountList extends Component {
  constructor(props) {
    super(props);

    this.settings = new Settings('accountList');

    const columns = [
      { key: 'customerId', text: 'Customer ID', selected: false },
      { key: 'name', text: 'Name', selected: true },
      { key: 'contactInformation', text: 'Contact information', selected: true },
      { key: 'assignedTo', text: 'Assigned to', selected: true },
      { key: 'created', text: 'Created', selected: true },
      { key: 'modified', text: 'Modified', selected: true },
      { key: 'status', text: 'Status', selected: true },
      { key: 'tags', text: 'Tags', selected: true }
    ];

    this.state = {
      columns,
      accounts: [],
      pagination: {},
      statuses: [],
      loading: true
    };
  }

  async componentDidMount() {
    const settingsResponse = await this.settings.get();
    const data = await Account.query({ pageSize: 20 });
    const statusRequest = await Account.statuses();

    this.setState({
      ...settingsResponse.results,
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

  toggleColumn = index => {
    const { columns } = this.state;

    columns[index].selected = !columns[index].selected;

    this.settings.store({ columns }).then(() => {
      this.setState({ columns });
    });
  };

  export = () => {
    console.log('Exported accounts');
  };

  render() {
    const { columns, accounts, pagination, statuses, loading } = this.state;

    return (
      <BlockUI blocking={loading}>
        <List>
          <div className="list-header">
            <ColumnDisplay columns={columns} toggleColumn={this.toggleColumn} />

            <button className="hl-primary-btn m-l-10 m-r-10" onClick={this.export}>
              Export accounts
            </button>

            <ListFilter label="Account status" items={statuses} />
          </div>
          <table className="hl-table">
            <thead>
              <tr>
                {columns[0].selected && <th>Customer ID</th>}
                {columns[1].selected && <th>Account</th>}
                {columns[2].selected && <th>Contact information</th>}
                {columns[3].selected && <th>Assigned to</th>}
                {columns[4].selected && <th>Created</th>}
                {columns[5].selected && <th>Modified</th>}
                {columns[6].selected && <th>Status</th>}
                {columns[7].selected && <th>Tags</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(account => (
                <tr key={account.id}>
                  {columns[0].selected && <td>{account.customerId}</td>}
                  {columns[1].selected && (
                    <td>
                      <Link to={`/accounts/${account.id}`}>{account.name}</Link>
                    </td>
                  )}
                  {columns[2].selected && (
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
                  )}
                  {columns[3].selected && (
                    <td>
                      <Editable type="select" object={account} field="assignedTo" />
                    </td>
                  )}
                  {columns[4].selected && (
                    <td>
                      <LilyDate date={account.created} />
                    </td>
                  )}
                  {columns[5].selected && (
                    <td>
                      <LilyDate date={account.modified} />
                    </td>
                  )}
                  {columns[6].selected && <td>{account.status.name}</td>}
                  {columns[7].selected && (
                    <td>
                      {account.tags.map(tag => (
                        <div key={tag.id}>{tag.name}</div>
                      ))}
                    </td>
                  )}
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
