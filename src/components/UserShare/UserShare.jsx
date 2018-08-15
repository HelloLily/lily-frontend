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
      privacyOptions: EmailAccount.privacyOptions()
    };
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
    const { privacyOptions } = this.state;

    return (
      <div className="shared-with-users">
        {this.state.emailAccount.sharedEmailConfigs.map(config => (
          <div className={`user-row${config.isDeleted ? ' is-deleted' : ''}`} key={config.id}>
            <div className="user-info">
              <img
                className="user-avatar m-r-15"
                src={config.user.profilePicture}
                alt="User avatar"
              />
              <div>{config.user.fullName}</div>
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
        ))}

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
    );
  }
}

export default UserShare;
