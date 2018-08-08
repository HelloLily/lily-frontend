import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import FeatureUnavailableMarker from 'components/Billing/FeatureUnavailableMarker';
import withContext from 'src/withContext';

class NavDropdown extends Component {
  constructor() {
    super();

    this.state = {
      showMenu: false
    };
  }

  showMenu = event => {
    event.preventDefault();

    this.setState({ showMenu: true }, () => {
      document.addEventListener('click', this.closeMenu);
    });
  };

  closeMenu = event => {
    if (!this.dropdownMenu.contains(event.target)) {
      this.setState({ showMenu: false }, () => {
        document.removeEventListener('click', this.closeMenu);
      });
    }
  };

  render() {
    return (
      <div>
        <div className="header-avatar clickable m-r-20" onClick={this.showMenu}>
          <img src={this.props.currentUser.profilePicture} className="m-r-5" alt="User avatar" />
          <i className="lilicon hl-arrow-down-smll-icon" />
        </div>

        {this.state.showMenu ? (
          <ul
            className="dropdown-menu m-t-5"
            ref={element => {
              this.dropdownMenu = element;
            }}
          >
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
                <NavLink to="/preferences/webhook" exact>
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
                <FontAwesomeIcon icon="envelope-open" /> Email templates
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
                <i className="lilicon hl-entities-icon" /> Users
              </NavLink>
            </li>

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
                <i className="lilicon hl-entities-icon" /> Import
              </NavLink>
            </li>

            <li className="dropdown-menu-item">
              <NavLink to="/preferences/settings" exact>
                <i className="lilicon hl-cog-icon" /> Settings
              </NavLink>
            </li>

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
        ) : null}
      </div>
    );
  }
}

export default withContext(NavDropdown);
