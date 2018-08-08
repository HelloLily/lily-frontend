import React, { Component } from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/lib/Async';

import { get } from 'lib/api';
import { SELECT_STYLES } from 'lib/constants';
import User from 'models/User';
import EmailAccount from 'models/EmailAccount';

class UserShare extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: []
    };
  }

  async componentDidMount() {
    const userResponse = User.query();

    this.setState({ users: userResponse });
  }

  searchUsers = async query => {
    // TODO: This needs to have search query and sorting implemented.
    // Search the given model with the search query and any specific sorting.
    const request = await get(`/users`);

    return request.results;
  };

  render() {
    const { users } = this.state;

    return (
      <div>
        {/* {this.props.emailAccount.sharedEmailConfigs.map(config => {
          {
            !config.isDeleted ? (
              <div className="user-info">
                <div className="user-avatar" />
                <div className="m-l-15">{config.user.fullName}</div>
              </div>
            ) : null;
          }
        })} */}

        <div className="display-flex">
          <AsyncSelect
            isMulti
            defaultOptions
            // value={values.assignedTo}
            styles={SELECT_STYLES}
            placeholder="Select people to share the account with"
            onChange={value => this.props.handleAdditions(value)}
            loadOptions={this.searchUsers}
            getOptionLabel={option => option.fullName}
            getOptionValue={option => option.fullName}
          />

          <Select
            styles={SELECT_STYLES}
            options={EmailAccount.privacyOptions()}
            getOptionLabel={option => option.name}
          />

          <button className="hl-primary-btn-green" onClick={this.props.addAdditions} type="button">
            Add
          </button>
        </div>
      </div>
    );
  }
}

export default UserShare;
