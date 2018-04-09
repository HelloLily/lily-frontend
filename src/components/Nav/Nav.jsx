import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { translate } from 'react-i18next';
import navItems from 'app/config/nav.json';

import NavDropdown from './NavDropdown';
import SubNav from './SubNav';

class Nav extends Component {
  render() {
    const { t } = this.props;

    return (
      <div className="navbar">
        <div className="main-nav">
          <nav ref="nav">
            <ul className="main-nav-links">
              <li>
                <NavLink to="/" exact className="m-l-20 m-r-40">
                  <i className="lilicon hl-lily-icon"></i>
                </NavLink>
              </li>

              {navItems.map((navItem, index) => (
                <li key={index} className="m-r-55">
                  <NavLink to={navItem.link} exact>
                    <i className={`lilicon hl-${navItem.icon}-icon m-r-10`}></i>
                    <span className="nav-text">{t(navItem.text)}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <NavDropdown />
        </div>

        <SubNav sidebarRef={this.props.sidebarRef} />
      </div>
    );
  }
}

export default translate(['shared', 'nav'])(Nav);
