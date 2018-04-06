import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

class NavDropdown extends Component {
  constructor() {
    super();

    this.state = {
      showMenu: false,
    };
  }

  showMenu = event => {
    event.preventDefault();

    this.setState({ showMenu: true }, () => {
      document.addEventListener('click', this.closeMenu);
    });
  }

  closeMenu = event => {
    if (!this.dropdownMenu.contains(event.target)) {

      this.setState({ showMenu: false }, () => {
        document.removeEventListener('click', this.closeMenu);
      });
    }
  }

  render() {
    return (
      <div>
        <button onClick={this.showMenu}>
          Show menu
        </button>

        {
          this.state.showMenu
            ? (
              <ul
                className="dropdown-menu"
                ref={element => { this.dropdownMenu = element }}
              >

                <li>
                  <NavLink to="/" exact className="dropdown-menu-item">
                    <span className="lilicon hl-entity-icon" /> My profile
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/" exact className="dropdown-menu-item">
                    <span className="lilicon hl-cog-icon" /> My account
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/" exact className="dropdown-menu-item">
                    <FontAwesomeIcon icon="lock" /> Security
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/" exact className="dropdown-menu-item">
                    <FontAwesomeIcon icon="key" /> My API token
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/" exact className="dropdown-menu-item">
                    <FontAwesomeIcon icon="rocket" /> My webhook
                  </NavLink>
                </li>

                <div className="divider"></div>

                <li>
                  <NavLink to="/" exact className="dropdown-menu-item">
                    <span className="lilicon hl-email-icon" /> Email accounts
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/" exact className="dropdown-menu-item">
                    <FontAwesomeIcon icon="envelope-open" /> Email templates
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/" exact className="dropdown-menu-item">
                    <FontAwesomeIcon icon="code" /> Template variables
                  </NavLink>
                </li>

                <div className="divider"></div>

                <li>
                  <NavLink to="/" exact className="dropdown-menu-item">
                    <span className="lilicon hl-entities-icon" /> Users
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/" exact className="dropdown-menu-item">
                    <FontAwesomeIcon icon="plug" /> Integrations
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/" exact className="dropdown-menu-item">
                    <FontAwesomeIcon icon="credit-card" /> Billing
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/" exact className="dropdown-menu-item">
                    <span className="lilicon hl-entities-icon" /> Import
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/" exact className="dropdown-menu-item">
                    <span className="lilicon hl-cog-icon" /> Settings
                  </NavLink>
                </li>

                <div className="divider"></div>

                <li>
                  <NavLink to="/" exact className="dropdown-menu-item">
                    <FontAwesomeIcon icon="trophy" /> What's new
                  </NavLink>
                </li>

                <div className="divider"></div>

                <li>
                  <NavLink to="/" exact className="dropdown-menu-item">
                    <FontAwesomeIcon icon="sign-out-alt" /> Log out
                  </NavLink>
                </li>
              </ul>
            )
            : (
              null
            )
        }
      </div>
    );
  }
}

export default NavDropdown;
