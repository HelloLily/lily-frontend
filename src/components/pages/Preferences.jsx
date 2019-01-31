import React from 'react';
import { Switch, Route, NavLink, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import withContext from 'src/withContext';
import LoadingIndicator from 'components/Utils/LoadingIndicator';
import FeatureUnavailableMarker from 'components/Billing/FeatureUnavailableMarker';

const UserProfile = React.lazy(() => import('./UserProfile'));
const UserAccount = React.lazy(() => import('./UserAccount'));
const UserSecurity = React.lazy(() => import('./UserSecurity'));
const TokenForm = React.lazy(() => import('./TokenForm'));
const WebhookForm = React.lazy(() => import('./WebhookForm'));
const EmailAccountList = React.lazy(() => import('./EmailAccountList'));
const EmailAccountForm = React.lazy(() => import('./EmailAccountForm'));
const EmailTemplateForm = React.lazy(() => import('./EmailTemplateForm'));
const EmailTemplateList = React.lazy(() => import('./EmailTemplateList'));
const TemplateVariableForm = React.lazy(() => import('./TemplateVariableForm'));
const TemplateVariableList = React.lazy(() => import('./TemplateVariableList'));
const UserList = React.lazy(() => import('./UserList'));
const Integrations = React.lazy(() => import('./Integrations'));
const BillingOverview = React.lazy(() => import('./BillingOverview'));
const BillingChangePlan = React.lazy(() => import('./BillingChangePlan'));
const InviteForm = React.lazy(() => import('./InviteForm'));
const Import = React.lazy(() => import('./Import'));
const TenantSettings = React.lazy(() => import('./TenantSettings'));

const Preferences = ({ currentUser }) => (
  <div className="preferences">
    <React.Fragment>
      <div className="preferences-navigation">
        <ul>
          <img className="preferences-profile-picture" src={currentUser.profilePicture} />

          <div className="preferences-username m-b-10">{currentUser.fullName}</div>

          <li>
            <NavLink to="/preferences/profile" exact>
              <FontAwesomeIcon icon={['far', 'user-tag']} /> My profile
            </NavLink>
          </li>

          <li>
            <NavLink to="/preferences/account" exact>
              <FontAwesomeIcon icon={['far', 'user-cog']} /> My account
            </NavLink>
          </li>

          <li>
            <NavLink to="/preferences/security" exact>
              <FontAwesomeIcon icon={['far', 'user-lock']} /> My security
            </NavLink>
          </li>

          <li>
            <FeatureUnavailableMarker tier="2">
              <NavLink to="/preferences/token" exact>
                <FontAwesomeIcon icon={['far', 'key']} /> My API key
              </NavLink>
            </FeatureUnavailableMarker>
          </li>

          <li>
            <FeatureUnavailableMarker tier="2">
              <NavLink to="/preferences/webhooks" exact>
                <FontAwesomeIcon icon={['far', 'rocket']} /> My webhook
              </NavLink>
            </FeatureUnavailableMarker>
          </li>
        </ul>

        <ul>
          <li>
            <NavLink to="/preferences/emailaccounts">
              <FontAwesomeIcon icon={['far', 'mail-bulk']} /> Email accounts
            </NavLink>
          </li>

          <li>
            <NavLink to="/preferences/emailtemplates">
              <FontAwesomeIcon icon={['far', 'envelope-open-text']} /> Email templates
            </NavLink>
          </li>

          <li>
            <NavLink to="/preferences/templatevariables">
              <FontAwesomeIcon icon={['far', 'code']} /> Template variables
            </NavLink>
          </li>
        </ul>

        <ul>
          <li>
            <NavLink to="/preferences/users" exact>
              <FontAwesomeIcon icon={['far', 'users']} /> Colleagues
            </NavLink>
          </li>

          {currentUser.isAdmin && (
            <React.Fragment>
              <li>
                <FeatureUnavailableMarker tier="2">
                  <NavLink to="/preferences/integrations" exact>
                    <FontAwesomeIcon icon={['far', 'puzzle-piece']} /> Integrations
                  </NavLink>
                </FeatureUnavailableMarker>
              </li>

              <li>
                <NavLink to="/preferences/billing" exact>
                  <FontAwesomeIcon icon={['far', 'credit-card']} /> Subscription
                </NavLink>
              </li>

              <li>
                <NavLink to="/preferences/import" exact>
                  <FontAwesomeIcon icon={['far', 'file-import']} /> Import accounts / contacts
                </NavLink>
              </li>

              <li>
                <NavLink to="/preferences/settings" exact>
                  <FontAwesomeIcon icon={['far', 'cog']} /> Settings
                </NavLink>
              </li>
            </React.Fragment>
          )}
        </ul>

        <ul>
          <li>
            <a
              href="https://hellolily.com/blog/whats-new-lately/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={['far', 'trophy']} /> {"What's new"}
            </a>
          </li>
        </ul>

        <ul>
          <li>
            <Link to="/logout">
              <FontAwesomeIcon icon={['far', 'sign-out-alt']} /> Log out
            </Link>
          </li>
        </ul>
      </div>

      <div className="w-100">
        <React.Suspense fallback={<LoadingIndicator />}>
          <Switch>
            <Route path="/preferences/profile" component={UserProfile} />
            <Route path="/preferences/account" component={UserAccount} />
            <Route path="/preferences/security" component={UserSecurity} />
            <Route path="/preferences/token" component={TokenForm} />
            <Route path="/preferences/webhooks" component={WebhookForm} />
            <Route path="/preferences/emailaccounts/:id/edit" component={EmailAccountForm} />
            <Route path="/preferences/emailaccounts" component={EmailAccountList} />
            <Route path="/preferences/emailtemplates/:id/edit" component={EmailTemplateForm} />
            <Route path="/preferences/emailtemplates/create" component={EmailTemplateForm} />
            <Route path="/preferences/emailtemplates" component={EmailTemplateList} />
            <Route
              path="/preferences/templatevariables/:id/edit"
              component={TemplateVariableForm}
            />
            <Route path="/preferences/templatevariables/create" component={TemplateVariableForm} />
            <Route path="/preferences/templatevariables" component={TemplateVariableList} />
            <Route path="/preferences/users" component={UserList} />
            <Route path="/preferences/integrations" component={Integrations} />
            <Route path="/preferences/billing/change" component={BillingChangePlan} />
            <Route path="/preferences/billing" component={BillingOverview} />
            <Route path="/preferences/invite" component={InviteForm} />
            <Route path="/preferences/import" component={Import} />
            <Route path="/preferences/settings" component={TenantSettings} />
          </Switch>
        </React.Suspense>
      </div>
    </React.Fragment>
  </div>
);

export default withContext(Preferences);
