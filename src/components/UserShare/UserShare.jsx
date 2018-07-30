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
        {/* <div ng-repeat="config in vm.emailAccount.shared_email_configs" ng-if="!config.is_deleted" class="user-row">
            <div class="user-info">
                <div class="user-avatar display-inline-block" ng-style="{'background-image': 'url(' + config.user.profile_picture + ')'}"></div>
                <span class="m-l-15">{{ config.user.full_name }}</span>
            </div>

            <div class="sharing-actions">
                <ui-select ng-model="config.privacy" theme="select2" class="form-control email-account-share-privacy" name="privacy" append-to-body="true" search-enabled="false">
                    <ui-select-match placeholder="Privacy">{{ $select.selected.name }}</ui-select-match>
                    <ui-select-choices repeat="option.id as option in vm.privacyOptions">
                        <div ng-bind-html="option.name"></div>
                    </ui-select-choices>
                </ui-select>

                <div class="clickable m-l-10" ng-click="config.is_deleted = true"><i class="lilicon hl-close-icon"></i></div>
            </div>
        </div> */}

        {this.props.emailAccount.sharedEmailConfigs.map(config => {
          {
            !config.isDeleted ? (
              <div className="user-info">
                <div className="user-avatar" />
                <div className="m-l-15">{config.user.fullName}</div>
              </div>
            ) : null;
          }
        })}

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
