import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import withContext from 'src/withContext';
import Editable from 'components/Editable';
import List from 'components/List';
import ColumnDisplay from 'components/List/ColumnDisplay';
import LilyPagination from 'components/LilyPagination';
import BlockUI from 'components/Utils/BlockUI';
import Settings from 'models/Settings';
import UserInvite from 'models/UserInvite';
import UserTeam from 'models/UserTeam';
import User from 'models/User';

class UserList extends Component {
  constructor(props) {
    super(props);

    this.settings = new Settings('userList');

    const columns = [
      { key: 'fullName', text: 'Name', selected: true },
      { key: 'teams', text: 'Team(s)', selected: true },
      { key: 'email', text: 'Email address', selected: true },
      { key: 'phoneNumber', text: 'Phone number', selected: true },
      { key: 'internalNumber', text: 'Internal number', selected: true },
      { key: 'isActive', text: 'Status', selected: true },
      { key: 'twoFactor', text: '2FA Active', selected: true }
    ];

    this.state = {
      columns,
      users: [],
      invites: [],
      pagination: {},
      loading: true,
      statusFilter: 0
    };
  }

  async componentDidMount() {
    const userResponse = await User.query({ pageSize: 20 });
    const inviteResponse = await UserInvite.query({ pageSize: 20 });

    this.setState({
      users: userResponse.results,
      invites: inviteResponse.results,
      pagination: userResponse.pagination,
      loading: false
    });
  }

  setFilter = value => {
    this.setState({ statusFilter: value });
  };

  setPage = async page => {
    this.setState({ loading: true });

    const userResponse = await User.query({ pageSize: 20, page });

    this.setState({
      users: userResponse.results,
      pagination: userResponse.pagination,
      loading: false
    });
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

  toggleColumn = index => {
    const { columns } = this.state;

    columns[index].selected = !columns[index].selected;

    this.settings.store({ columns }).then(() => {
      this.setState({ columns });
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
            <ColumnDisplay
              className="flex-grow"
              columns={columns}
              toggleColumn={this.toggleColumn}
            />

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
                {columns[0].selected && <th>Name</th>}
                {columns[1].selected && <th>Team(s)</th>}
                {columns[2].selected && <th>Email address</th>}
                {columns[3].selected && <th>Phone number</th>}
                {columns[4].selected && <th>Internal number</th>}
                {columns[5].selected && <th>Status</th>}
                {columns[6].selected && <th>2FA Active</th>}
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
                    <div className="label info">Invited</div>
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
                      {user.teams.map(team => (
                        <div key={team.id}>{team.name}</div>
                      ))}
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
                      <div className={`label ${user.isActive ? 'success' : ''}`}>
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
