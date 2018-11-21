import React, { Component } from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { debounce } from 'debounce';

import { SELECT_STYLES, DEBOUNCE_WAIT } from 'lib/constants';
import LoadingIndicator from 'components/Utils/LoadingIndicator';
import User from 'models/User';
import EmailAccount from 'models/EmailAccount';

class UserShare extends Component {
  constructor(props) {
    super(props);

    const privacyOptions = EmailAccount.privacyOptions();
    const privacy = privacyOptions[0];

    this.state = {
      privacyOptions,
      privacy,
      users: [],
      shareAdditions: [],
      loading: true
    };
  }

  async componentDidMount() {
    const { emailAccount } = this.props;

    const promises = emailAccount.sharedEmailConfigs.map(async config => {
      const user = await User.get(config.user);

      return user;
    });
    const users = await Promise.all(promises);

    this.setState({ users, loading: false });
  }

  toggleDelete = config => {
    const { emailAccount, updateEmailAccount } = this.props;

    const foundConfig = emailAccount.sharedEmailConfigs.find(
      emailConfig => emailConfig.id === config.id
    );

    if (foundConfig) {
      foundConfig.isDeleted = !foundConfig.isDeleted;
    }

    updateEmailAccount(emailAccount);
  };

  searchUsers = async query => {
    // TODO: This needs to have search query and sorting implemented.
    // Search the given model with the search query and any specific sorting.
    const request = await User.query({ query });

    return request.results;
  };

  handlePrivacy = value => {
    this.setState({ privacy: value });
  };

  handleConfigPrivacy = (index, value) => {
    const { emailAccount, updateEmailAccount } = this.props;

    emailAccount.sharedEmailConfigs[index].privacy = value.id;

    updateEmailAccount(emailAccount);
  };

  handleAdditions = value => {
    this.setState({ shareAdditions: value });
  };

  addAdditions = () => {
    const { shareAdditions, privacy } = this.state;
    const { emailAccount, updateEmailAccount } = this.props;

    shareAdditions.forEach(user => {
      emailAccount.sharedEmailConfigs.push({
        user,
        privacy: privacy.id,
        emailAccount: emailAccount.id
      });
    });

    updateEmailAccount(emailAccount);

    this.setState({ shareAdditions: [] });
  };

  render() {
    const { privacyOptions, privacy, users, shareAdditions, loading } = this.state;
    const { emailAccount } = this.props;

    return (
      <React.Fragment>
        {!loading ? (
          <div className="shared-with-users">
            {emailAccount.sharedEmailConfigs.map((config, index) => {
              let foundUser;

              if (config.user.hasOwnProperty('id')) {
                foundUser = config.user;
              } else {
                foundUser = users.find(user => user.id === config.user);
              }

              return (
                <div
                  className={`user-row${config.isDeleted ? ' is-deleted' : ''}`}
                  key={config.user.id || config.user}
                >
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
                    options={privacyOptions}
                    className="user-share-container"
                    onChange={value => this.handleConfigPrivacy(index, value)}
                    value={privacyOptions[config.privacy]}
                    getOptionLabel={option => option.name}
                    getOptionValue={option => option.id}
                    menuPortalTarget={document.body}
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
                onChange={this.handleAdditions}
                loadOptions={debounce(this.searchContacts, DEBOUNCE_WAIT)}
                getOptionLabel={option => option.fullName}
                getOptionValue={option => option.id}
                className="user-share-container"
                classNamePrefix="user-share"
                value={shareAdditions}
                menuPortalTarget={document.body}
              />

              <Select
                value={privacy}
                styles={SELECT_STYLES}
                options={privacyOptions}
                onChange={this.handlePrivacy}
                className="user-share-container"
                classNamePrefix="user-share"
                getOptionLabel={option => option.name}
                getOptionValue={option => option.id}
                menuPortalTarget={document.body}
              />

              <button
                className="hl-primary-btn-green m-l-5"
                type="button"
                onClick={this.addAdditions}
              >
                Add
              </button>
            </div>
          </div>
        ) : (
          <LoadingIndicator small />
        )}
      </React.Fragment>
    );
  }
}

export default UserShare;
