import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import withContext from 'src/withContext';
import { NO_SORT_STATUS } from 'lib/constants';
import Editable from 'components/Editable';
import List from 'components/List';
import ColumnDisplay from 'components/List/ColumnDisplay';
import LilyPagination from 'components/LilyPagination';
import BlockUI from 'components/Utils/BlockUI';
import ListColumns from 'components/List/ListColumns';
import Settings from 'models/Settings';
import UserInvite from 'models/UserInvite';
import UserTeam from 'models/UserTeam';
import User from 'models/User';

class UserList extends Component {
  constructor(props) {
    super(props);

    this.settings = new Settings('userList');

    const columns = [
      { key: 'fullName', text: 'Name', selected: true, sort: 'fullName' },
      { key: 'teams', text: 'Team(s)', selected: true, sort: 'teams.name' },
      { key: 'email', text: 'Email address', selected: true, sort: 'email' },
      { key: 'phoneNumber', text: 'Phone number', selected: true, sort: 'phoneNumber' },
      { key: 'internalNumber', text: 'Internal number', selected: true, sort: 'internalNumber' },
      { key: 'isActive', text: 'Status', selected: true, sort: 'isActive' },
      { key: 'twoFactor', text: '2FA Active', selected: true }
    ];

    this.state = {
      columns,
      users: [],
      invites: [],
      pagination: {},
      loading: true,
      statusFilter: 0,
      sortColumn: '',
      sortStatus: NO_SORT_STATUS
    };
  }

  async componentDidMount() {
    const inviteResponse = await UserInvite.query({ pageSize: 20 });
    await this.loadItems();

    this.setState({
      invites: inviteResponse.results,
      loading: false
    });
  }

  setFilter = value => {
    this.setState({ statusFilter: value });
  };

  setPage = async page => {
    this.setState({ page }, this.loadItems);
  };

  setSorting = (sortColumn, sortStatus) => {
    this.setState({ sortColumn, sortStatus }, this.loadItems);
  };

  handleName = event => {
    const { newTeam } = this.state;

    newTeam.name = event.target.value;

    this.setState({ newTeam });
  };

  addTeam = () => {
    this.setState({ newTeam: { name: '' } });
  };

  saveNewTeam = () => {
    const { newTeam } = this.state;

    this.setState({ loading: true });

    UserTeam.post(newTeam).then(() => {
      this.setState({ newTeam: null, loading: false });
    });
  };

  cancelNewTeam = () => {
    this.setState({ newTeam: null });
  };

  toggleColumn = async index => {
    const { columns } = this.state;

    columns[index].selected = !columns[index].selected;

    await this.settings.store({ columns });
    this.setState({ columns });
  };

  loadItems = async () => {
    const { page, sortColumn, sortStatus } = this.state;

    this.setState({ loading: true });

    const data = await User.query({
      pageSize: 20,
      page,
      sortColumn,
      sortStatus
    });

    this.setState({
      users: data.results,
      pagination: data.pagination,
      loading: false
    });
  };

  submitCallback = args => {
    this.setState({ loading: true });

    return User.patch(args).then(() => {
      this.setState({ loading: false }, this.loadItems);
    });
  };

  render() {
    const { columns, users, invites, pagination, loading, statusFilter, newTeam } = this.state;

    const filterOptions = ['All', 'Active', 'Inactive', 'Invited'];

    return (
      <BlockUI blocking={loading}>
        <List>
          <div className="list-header">
            <div className="list-title flex-grow">Users</div>

            <Link to="/preferences/invite" className="hl-primary-btn m-r-10">
              <FontAwesomeIcon icon="plus" /> User
            </Link>

            <button className="hl-primary-btn" onClick={this.addTeam}>
              <FontAwesomeIcon icon="plus" /> Team
            </button>
          </div>
          <div className="list-header">
            <div className="flex-grow">
              <ColumnDisplay columns={columns} toggleColumn={this.toggleColumn} />
            </div>

            <div className="filter-group">
              {filterOptions.map((option, index) => {
                const buttonClassName = `hl-primary-btn${statusFilter === index ? ' active' : ''}`;

                return (
                  <button
                    key={`option-${option.toLowerCase()}`}
                    className={buttonClassName}
                    onClick={() => this.setFilter(index)}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <table className="hl-table">
            <thead>
              <tr>
                <ListColumns columns={columns} setSorting={this.setSorting} />
                <th>Actions</th>
              </tr>
            </thead>

            {newTeam && (
              <tbody>
                <tr>
                  <td colSpan="8">
                    <div className="editable-wrap display-flex">
                      <input
                        type="text"
                        className="editable-input editable-has-buttons"
                        onChange={this.handleName}
                      />
                      <span className="editable-buttons">
                        <button onClick={this.saveNewTeam}>
                          <FontAwesomeIcon icon="check" />
                        </button>
                        <button onClick={this.cancelNewTeam}>
                          <FontAwesomeIcon icon="times" />
                        </button>
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            )}

            <tbody>
              {invites.map(invite => (
                <tr key={invite.id}>
                  <td>{invite.firstName}</td>
                  <td />
                  <td>{invite.email}</td>
                  <td colSpan="2" />
                  <td>
                    <div className="label info w-100">Invited</div>
                  </td>
                  <td />
                  <td>
                    <button className="hl-primary-btn borderless" type="button">
                      <FontAwesomeIcon icon="undo" />
                    </button>

                    <button className="hl-primary-btn borderless" type="button">
                      <i className="lilicon hl-trashcan-icon" />
                    </button>
                  </td>
                </tr>
              ))}

              {users.map(user => (
                <tr key={user.id}>
                  {columns[0].selected && <td>{user.fullName}</td>}
                  {columns[1].selected && (
                    <td>
                      <Editable
                        multi
                        type="select"
                        field="teams"
                        object={user}
                        submitCallback={this.submitCallback}
                      />
                    </td>
                  )}
                  {columns[2].selected && <td>{user.email}</td>}
                  {columns[3].selected && <td>{user.phoneNumber}</td>}
                  {columns[4].selected && (
                    <td>
                      <Editable
                        type="text"
                        object={user}
                        field="internalNumber"
                        // submitCallback={submitCallback}
                      />
                    </td>
                  )}
                  {columns[5].selected && (
                    <td>
                      <div className={`label w-100 ${user.isActive ? 'success' : ''}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </td>
                  )}
                  {columns[6].selected && (
                    <td>{user.hasTwoFactor && <FontAwesomeIcon icon="lock" />}</td>
                  )}
                  <td />
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

export default withContext(UserList);
