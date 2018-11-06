import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import withContext from 'src/withContext';
import FeatureUnavailableMarker from 'components/Billing/FeatureUnavailableMarker';
import Dropdown from 'components/Dropdown';

const NavDropdown = ({ currentUser }) => (
  <div>
    <Dropdown
      className="display-flex"
      clickable={
        <div className="header-avatar m-r-20">
          {currentUser.profilePicture ? (
            <img src={currentUser.profilePicture} alt="User avatar" />
          ) : (
            <div className="avatar-placeholder" />
          )}
          <i className="lilicon hl-arrow-down-smll-icon m-l-5" />
        </div>
      }
      menu={
        <ul className="nav-dropdown-menu m-t-5">
          <li className="dropdown-menu-item">
            <NavLink to="/preferences/profile" exact>
              <i className="lilicon hl-entity-icon" /> My profile
            </NavLink>
          </li>

          <li className="dropdown-menu-item">
            <NavLink to="/preferences/account" exact>
              <i className="lilicon hl-cog-icon" /> My account
            </NavLink>
          </li>

          <li className="dropdown-menu-item">
            <NavLink to="/preferences/security" exact>
              <FontAwesomeIcon icon="lock" /> Security
            </NavLink>
          </li>

          <li className="dropdown-menu-item">
            <FeatureUnavailableMarker tier="2">
              <NavLink to="/preferences/token" exact>
                <FontAwesomeIcon icon="key" /> My API token
              </NavLink>
            </FeatureUnavailableMarker>
          </li>

          <li className="dropdown-menu-item">
            <FeatureUnavailableMarker tier="2">
              <NavLink to="/preferences/webhooks" exact>
                <FontAwesomeIcon icon="rocket" /> My webhook
              </NavLink>
            </FeatureUnavailableMarker>
          </li>

          <div className="divider" />

          <li className="dropdown-menu-item">
            <NavLink to="/preferences/emailaccounts" exact>
              <i className="lilicon hl-email-icon" /> Email accounts
            </NavLink>
          </li>

          <li className="dropdown-menu-item">
            <NavLink to="/preferences/emailtemplates" exact>
              <FontAwesomeIcon icon="envelope-open-text" /> Email templates
            </NavLink>
          </li>

          <li className="dropdown-menu-item">
            <NavLink to="/preferences/templatevariables" exact>
              <FontAwesomeIcon icon="code" /> Template variables
            </NavLink>
          </li>

          <div className="divider" />

          <li className="dropdown-menu-item">
            <NavLink to="/preferences/users" exact>
              <i className="lilicon hl-entities-icon" /> Colleagues
            </NavLink>
          </li>

          {currentUser.isAdmin && (
            <React.Fragment>
              <li className="dropdown-menu-item">
                <FeatureUnavailableMarker tier="2">
                  <NavLink to="/preferences/integrations" exact>
                    <FontAwesomeIcon icon="plug" /> Integrations
                  </NavLink>
                </FeatureUnavailableMarker>
              </li>

              <li className="dropdown-menu-item">
                <NavLink to="/preferences/billing" exact>
                  <FontAwesomeIcon icon="credit-card" /> Billing
                </NavLink>
              </li>

              <li className="dropdown-menu-item">
                <NavLink to="/preferences/import" exact>
                  <FontAwesomeIcon icon="file-import" /> Import
                </NavLink>
              </li>

              <li className="dropdown-menu-item">
                <NavLink to="/preferences/settings" exact>
                  <i className="lilicon hl-cog-icon" /> Settings
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
              <FontAwesomeIcon icon="trophy" /> {"What's new"}
            </a>
          </li>

          <div className="divider" />

          <li className="dropdown-menu-item">
            <NavLink to="/logout" exact>
              <FontAwesomeIcon icon="sign-out-alt" /> Log out
            </NavLink>
          </li>
        </ul>
      }
    />
  </div>
);

export default withContext(NavDropdown);
