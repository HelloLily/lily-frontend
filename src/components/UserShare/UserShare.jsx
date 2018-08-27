import React, { Component } from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { SELECT_STYLES } from 'lib/constants';
import User from 'models/User';
import EmailAccount from 'models/EmailAccount';

class UserShare extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emailAccount: {},
      privacyOptions: EmailAccount.privacyOptions(),
      users: [],
      loading: true
    };
  }

  async componentDidMount() {
    const promises = this.state.emailAccount.sharedEmailConfigs.map(async config => {
      const user = await User.get(config.user);

      return user;
    });
    const users = await Promise.all(promises);

    this.setState({ users, loading: false });
  }

  static getDerivedStateFromProps = nextProps => ({ emailAccount: nextProps.emailAccount });

  toggleDelete = config => {
    const { emailAccount } = this.state;

    const foundConfig = emailAccount.sharedEmailConfigs.find(
      emailConfig => emailConfig.id === config.id
    );

    if (foundConfig) {
      foundConfig.isDeleted = !foundConfig.isDeleted;
    }

    this.setState({ emailAccount });
  };

  searchUsers = async query => {
    // TODO: This needs to have search query and sorting implemented.
    // Search the given model with the search query and any specific sorting.
    const request = await User.query({ query });

    return request.results;
  };

  render() {
    const { privacyOptions, users, loading } = this.state;

    return (
      <React.Fragment>
        {!loading ? (
          <div className="shared-with-users">
            {this.state.emailAccount.sharedEmailConfigs.map(config => {
              const foundUser = users.find(user => user.id === config.user);

              return (
                <div className={`user-row${config.isDeleted ? ' is-deleted' : ''}`} key={config.id}>
                  <div className="user-info">
                    <img
                      className="user-avatar m-r-15"
                      src={foundUser.profilePicture}
                      alt="User avatar"
                    />
                    <div>{foundUser.fullName}</div>
                  </div>

                  <Select
                    styles={SELECT_STYLES}
                    options={EmailAccount.privacyOptions()}
                    getOptionLabel={option => option.name}
                    className="user-share-container"
                  />

                  <button
                    type="button"
                    className="hl-primary-btn m-l-15"
                    onClick={() => this.toggleDelete(config)}
                  >
                    {config.isDeleted ? (
                      <FontAwesomeIcon icon="undo" />
                    ) : (
                      <i className="lilicon hl-trashcan-icon" />
                    )}
                  </button>
                </div>
              );
            })}

            <div className="user-share m-t-25">
              <AsyncSelect
                isMulti
                defaultOptions
                styles={SELECT_STYLES}
                placeholder="Select people to share the account with"
                onChange={value => this.props.handleAdditions(value)}
                loadOptions={this.searchUsers}
                getOptionLabel={option => option.fullName}
                getOptionValue={option => option.fullName}
                className="user-share-container"
                classNamePrefix="user-share"
              />

              <Select
                value={privacyOptions[0]}
                styles={SELECT_STYLES}
                options={privacyOptions}
                getOptionLabel={option => option.name}
                className="user-share-container"
                classNamePrefix="user-share"
              />

              <button
                className="hl-primary-btn-green m-l-5"
                onClick={this.props.addAdditions}
                type="button"
              >
                Add
              </button>
            </div>
          </div>
        ) : (
          <div>Loading</div>
        )}
      </React.Fragment>
    );
  }
}

export default UserShare;
