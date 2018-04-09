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
        <div className="header-avatar clickable m-r-20" onClick={this.showMenu}>
          <img src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm" className="m-r-5" />
          <i className="lilicon hl-arrow-down-smll-icon"></i>
        </div>

        {
          this.state.showMenu
            ? (
              <ul
                className="dropdown-menu m-t-5"
                ref={element => { this.dropdownMenu = element }}
              >

                <li className="dropdown-menu-item">
                  <NavLink to="/" exact>
                    <i className="lilicon hl-entity-icon"></i> My profile
                  </NavLink>
                </li>

                <li className="dropdown-menu-item">
                  <NavLink to="/" exact>
                    <i className="lilicon hl-cog-icon"></i> My account
                  </NavLink>
                </li>

                <li className="dropdown-menu-item">
                  <NavLink to="/" exact>
                    <FontAwesomeIcon icon="lock" /> Security
                  </NavLink>
                </li>

                <li className="dropdown-menu-item">
                  <NavLink to="/" exact>
                    <FontAwesomeIcon icon="key" /> My API token
                  </NavLink>
                </li>

                <li className="dropdown-menu-item">
                  <NavLink to="/" exact>
                    <FontAwesomeIcon icon="rocket" /> My webhook
                  </NavLink>
                </li>

                <div className="divider"></div>

                <li className="dropdown-menu-item">
                  <NavLink to="/" exact>
                    <i className="lilicon hl-email-icon"></i> Email accounts
                  </NavLink>
                </li>

                <li className="dropdown-menu-item">
                  <NavLink to="/" exact>
                    <FontAwesomeIcon icon="envelope-open" /> Email templates
                  </NavLink>
                </li>

                <li className="dropdown-menu-item">
                  <NavLink to="/" exact>
                    <FontAwesomeIcon icon="code" /> Template variables
                  </NavLink>
                </li>

                <div className="divider"></div>

                <li className="dropdown-menu-item">
                  <NavLink to="/" exact>
                    <i className="lilicon hl-entities-icon"></i> Users
                  </NavLink>
                </li>

                <li className="dropdown-menu-item">
                  <NavLink to="/" exact>
                    <FontAwesomeIcon icon="plug" /> Integrations
                  </NavLink>
                </li>

                <li className="dropdown-menu-item">
                  <NavLink to="/" exact>
                    <FontAwesomeIcon icon="credit-card" /> Billing
                  </NavLink>
                </li>

                <li className="dropdown-menu-item">
                  <NavLink to="/" exact>
                    <i className="lilicon hl-entities-icon"></i> Import
                  </NavLink>
                </li>

                <li className="dropdown-menu-item">
                  <NavLink to="/" exact>
                    <i className="lilicon hl-cog-icon"></i> Settings
                  </NavLink>
                </li>

                <div className="divider"></div>

                <li className="dropdown-menu-item">
                  <a href="https://hellolily.com/blog/whats-new-lately/" target="_blank">
                    <FontAwesomeIcon icon="trophy" /> What's new
                  </a>
                </li>

                <div className="divider"></div>

                <li className="dropdown-menu-item">
                  <NavLink to="/logout" exact>
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
