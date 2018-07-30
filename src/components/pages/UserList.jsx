import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import List from 'components/List';
import Editable from 'components/Editable';
import LilyPagination from 'components/LilyPagination';
import BlockUI from 'components/Utils/BlockUI';
import User from 'models/User';

class UserList extends Component {
  constructor(props) {
    super(props);

    this.state = { users: [], pagination: {}, loading: true };
  }

  async componentDidMount() {
    const userResponse = await User.query({ pageSize: 20 });

    this.setState({
      users: userResponse.results,
      pagination: userResponse.pagination,
      loading: false
    });
  }

  setPage = async page => {
    this.setState({ loading: true });

    const userResponse = await User.query({ pageSize: 20, page });

    this.setState({
      users: userResponse.results,
      pagination: userResponse.pagination,
      loading: false
    });
  };

  addTeam = () => {};

  render() {
    const { users, pagination, loading } = this.state;

    return (
      <BlockUI blocking={loading}>
        <List>
          <div className="list-header">
            <div className="list-title flex-grow">Users</div>

            <button className="hl-primary-btn m-r-10">
              <FontAwesomeIcon icon="plus" /> User
            </button>

            <button className="hl-primary-btn" onClick={this.addTeam}>
              <FontAwesomeIcon icon="plus" /> Team
            </button>
          </div>
          <div className="list-header">
            {/* TODO: This should be some generic List thing. */}
            <button className="hl-primary-btn m-r-10">
              <FontAwesomeIcon icon="columns" />
              <span className="m-l-5 m-r-5">Columns</span>
              <i className="lilicon hl-toggle-down-icon small" />
            </button>
          </div>
          <table className="hl-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Team(s)</th>
                <th>Email</th>
                <th>Phone number</th>
                <th>Internal number</th>
                <th>Status</th>
                <th>2FA Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.fullName}</td>
                  <td>{user.teams.map(team => <div key={team.id}>{team.name}</div>)}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{user.internalNumber}</td>
                  <td>
                    <span className={`label ${user.isActive ? 'success' : ''}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{user.hasTwoFactor && <FontAwesomeIcon icon="lock" />}</td>
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

export default UserList;
