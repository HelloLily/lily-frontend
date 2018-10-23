import React from 'react';
import { Switch, Route, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import withContext from 'src/withContext';
import FeatureUnavailableMarker from 'components/Billing/FeatureUnavailableMarker';
import UserProfile from './UserProfile';
import UserAccount from './UserAccount';
import TokenForm from './TokenForm';
import WebhookForm from './WebhookForm';
import EmailAccountList from './EmailAccountList';
import EmailAccountForm from './EmailAccountForm';
import EmailTemplateForm from './EmailTemplateForm';
import EmailTemplateList from './EmailTemplateList';
import TemplateVariableForm from './TemplateVariableForm';
import TemplateVariableList from './TemplateVariableList';
import UserList from './UserList';
import Integrations from './Integrations';
import BillingOverview from './BillingOverview';
import InviteForm from './InviteForm';
import Import from './Import';
import TenantSettings from './TenantSettings';

const Preferences = ({ currentUser }) => (
  <div className="preferences">
    <React.Fragment>
      <div className="preferences-navigation">
        <ul>
          <img
            className="preferences-profile-picture"
            src={currentUser.profilePicture}
            alt="User avatar"
          />

          <div className="preferences-username m-b-10">{currentUser.fullName}</div>

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
              <NavLink to="/preferences/webhooks" exact>
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

          {currentUser.isAdmin && (
            <React.Fragment>
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
            </React.Fragment>
          )}
        </ul>
      </div>

      <div className="w-100">
        <Switch>
          <Route path="/preferences/profile" component={UserProfile} />
          <Route path="/preferences/account" component={UserAccount} />
          <Route path="/preferences/token" component={TokenForm} />
          <Route path="/preferences/webhooks" component={WebhookForm} />
          <Route path="/preferences/emailaccounts/:id/edit" component={EmailAccountForm} />
          <Route path="/preferences/emailaccounts" component={EmailAccountList} />
          <Route path="/preferences/emailtemplates/create" component={EmailTemplateForm} />
          <Route path="/preferences/emailtemplates" component={EmailTemplateList} />
          <Route path="/preferences/templatevariables/:id/edit" component={TemplateVariableForm} />
          <Route path="/preferences/templatevariables/create" component={TemplateVariableForm} />
          <Route path="/preferences/templatevariables" component={TemplateVariableList} />
          <Route path="/preferences/users" component={UserList} />
          <Route path="/preferences/integrations" component={Integrations} />
          <Route path="/preferences/billing" component={BillingOverview} />
          <Route path="/preferences/invite" component={InviteForm} />
          <Route path="/preferences/import" component={Import} />
          <Route path="/preferences/settings" component={TenantSettings} />
        </Switch>
      </div>
    </React.Fragment>
  </div>
);

export default withContext(Preferences);
