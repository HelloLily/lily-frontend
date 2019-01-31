import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import withContext from 'src/withContext';
import FeatureUnavailableMarker from 'components/Billing/FeatureUnavailableMarker';
import Dropdown from 'components/Dropdown';

const NavDropdown = ({ currentUser }) => (
  <div>
    <Dropdown
      closeOnClick
      className="display-flex"
      clickable={
        <div className="header-avatar m-r-20">
          {currentUser.profilePicture ? (
            <img src={currentUser.profilePicture} />
          ) : (
            <div className="avatar-placeholder" />
          )}
          <FontAwesomeIcon icon={['fas', 'caret-down']} className="m-l-5" />
        </div>
      }
      menu={
        <ul className="nav-dropdown-menu">
          <li className="dropdown-menu-item">
            <NavLink to="/preferences/profile" exact>
              <FontAwesomeIcon icon={['far', 'user-tag']} /> My profile
            </NavLink>
          </li>

          <li className="dropdown-menu-item">
            <NavLink to="/preferences/account" exact>
              <FontAwesomeIcon icon={['far', 'user-cog']} /> My account
            </NavLink>
          </li>

          <li className="dropdown-menu-item">
            <NavLink to="/preferences/security" exact>
              <FontAwesomeIcon icon={['far', 'user-lock']} /> My security
            </NavLink>
          </li>

          <li className="dropdown-menu-item">
            <FeatureUnavailableMarker tier="2">
              <NavLink to="/preferences/token" exact>
                <FontAwesomeIcon icon={['far', 'key']} /> My API key
              </NavLink>
            </FeatureUnavailableMarker>
          </li>

          <li className="dropdown-menu-item">
            <FeatureUnavailableMarker tier="2">
              <NavLink to="/preferences/webhooks" exact>
                <FontAwesomeIcon icon={['far', 'rocket']} /> My webhook
              </NavLink>
            </FeatureUnavailableMarker>
          </li>

          <div className="divider" />

          <li className="dropdown-menu-item">
            <NavLink to="/preferences/emailaccounts" exact>
              <FontAwesomeIcon icon={['far', 'mail-bulk']} /> Email accounts
            </NavLink>
          </li>

          <li className="dropdown-menu-item">
            <NavLink to="/preferences/emailtemplates" exact>
              <FontAwesomeIcon icon={['far', 'envelope-open-text']} /> Email templates
            </NavLink>
          </li>

          <li className="dropdown-menu-item">
            <NavLink to="/preferences/templatevariables" exact>
              <FontAwesomeIcon icon={['far', 'code']} /> Template variables
            </NavLink>
          </li>

          <div className="divider" />

          <li className="dropdown-menu-item">
            <NavLink to="/preferences/users" exact>
              <FontAwesomeIcon icon={['far', 'users']} /> Colleagues
            </NavLink>
          </li>

          {currentUser.isAdmin && (
            <React.Fragment>
              <li className="dropdown-menu-item">
                <FeatureUnavailableMarker tier="2">
                  <NavLink to="/preferences/integrations" exact>
                    <FontAwesomeIcon icon={['far', 'puzzle-piece']} /> Integrations
                  </NavLink>
                </FeatureUnavailableMarker>
              </li>

              <li className="dropdown-menu-item">
                <NavLink to="/preferences/billing" exact>
                  <FontAwesomeIcon icon={['far', 'credit-card']} /> Subscription
                </NavLink>
              </li>

              <li className="dropdown-menu-item">
                <NavLink to="/preferences/import" exact>
                  <FontAwesomeIcon icon={['far', 'file-import']} /> Import accounts / contacts
                </NavLink>
              </li>

              <li className="dropdown-menu-item">
                <NavLink to="/preferences/settings" exact>
                  <FontAwesomeIcon icon={['far', 'cog']} /> Settings
                </NavLink>
              </li>
            </React.Fragment>
          )}

          <div className="divider" />

          <li className="dropdown-menu-item">
            <a
              href="https://hellolily.com/blog/whats-new-lately/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={['far', 'trophy']} /> {"What's new"}
            </a>
          </li>

          <div className="divider" />

          <li className="dropdown-menu-item">
            <Link to="/logout">
              <FontAwesomeIcon icon={['far', 'sign-out-alt']} /> Log out
            </Link>
          </li>
        </ul>
      }
    />
  </div>
);

export default withContext(NavDropdown);
