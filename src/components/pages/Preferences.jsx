import React, { Component } from 'react';
import { Switch, Route, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import User from 'models/User';
import FeatureUnavailableMarker from 'components/Billing/FeatureUnavailableMarker';
import UserProfile from './UserProfile';
import UserAccount from './UserAccount';
import EmailAccountList from './EmailAccountList';
import EmailAccountForm from './EmailAccountForm';
import EmailTemplateList from './EmailTemplateList';
import TemplateVariableList from './TemplateVariableList';
import UserList from './UserList';
import TenantSettings from './TenantSettings';

class Preferences extends Component {
  constructor(props) {
    super(props);

    this.state = { user: {} };
  }

  async componentDidMount() {
    const user = await User.me();

    this.setState({ user });
  }

  render() {
    const { user } = this.state;

    return (
      <div className="preferences">
        <React.Fragment>
          <div className="preferences-navigation">
            <ul>
              <img
                className="preferences-profile-picture"
                src={user.profilePicture}
                alt="User avatar"
              />

              <div className="preferences-username m-b-10">{user.fullName}</div>

              <li>
                <NavLink to="/preferences/profile" exact>
                  <i className="lilicon hl-entity-icon" /> My profile
                </NavLink>
              </li>

              <li>
                <NavLink to="/preferences/account" exact>
                  <i className="lilicon hl-cog-icon" /> My account
                </NavLink>
              </li>

              <li>
                <NavLink to="/preferences/security" exact>
                  <FontAwesomeIcon icon="lock" /> Security
                </NavLink>
              </li>

              <li>
                <FeatureUnavailableMarker tier="2">
                  <NavLink to="/preferences/token" exact>
                    <FontAwesomeIcon icon="key" /> My API token
                  </NavLink>
                </FeatureUnavailableMarker>
              </li>

              <li>
                <FeatureUnavailableMarker tier="2">
                  <NavLink to="/preferences/webhook" exact>
                    <FontAwesomeIcon icon="rocket" /> My webhook
                  </NavLink>
                </FeatureUnavailableMarker>
              </li>
            </ul>

            <ul>
              <li>
                <NavLink to="/preferences/emailaccounts" exact>
                  <i className="lilicon hl-email-icon" /> Email accounts
                </NavLink>
              </li>

              <li>
                <NavLink to="/preferences/emailtemplates" exact>
                  <FontAwesomeIcon icon="envelope-open" /> Email templates
                </NavLink>
              </li>

              <li>
                <NavLink to="/preferences/templatevariables" exact>
                  <FontAwesomeIcon icon="code" /> Template variables
                </NavLink>
              </li>
            </ul>

            <ul>
              <li>
                <NavLink to="/preferences/users" exact>
                  <i className="lilicon hl-entities-icon" /> Users
                </NavLink>
              </li>

              <li>
                <FeatureUnavailableMarker tier="2">
                  <NavLink to="/preferences/integrations" exact>
                    <FontAwesomeIcon icon="plug" /> Integrations
                  </NavLink>
                </FeatureUnavailableMarker>
              </li>

              <li>
                <NavLink to="/preferences/billing" exact>
                  <FontAwesomeIcon icon="credit-card" /> Billing
                </NavLink>
              </li>

              <li>
                <NavLink to="/preferences/import" exact>
                  <i className="lilicon hl-entities-icon" /> Import
                </NavLink>
              </li>

              <li>
                <NavLink to="/preferences/settings" exact>
                  <i className="lilicon hl-cog-icon" /> Settings
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="w-100">
            <Switch>
              <Route path="/preferences/profile" component={UserProfile} />
              <Route path="/preferences/account" component={UserAccount} />
              <Route path="/preferences/emailaccounts/:id/edit" component={EmailAccountForm} />
              <Route path="/preferences/emailaccounts" component={EmailAccountList} />
              <Route path="/preferences/emailtemplates" component={EmailTemplateList} />
              <Route path="/preferences/templatevariables" component={TemplateVariableList} />
              <Route path="/preferences/users" component={UserList} />
              <Route path="/preferences/settings" component={TenantSettings} />
            </Switch>
          </div>
        </React.Fragment>
      </div>
    );
  }
}

export default Preferences;
