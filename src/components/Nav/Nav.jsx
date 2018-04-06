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
            <NavLink to="/" exact className="m-l-20 m-r-20">
              <span className="lilicon hl-lily-icon" />
            </NavLink>

            <ul className="main-nav-links">
              {navItems.map((navItem, index) => (
                <li key={index} className="m-r-55">
                  <NavLink to={navItem.link} exact>
                    <span className={`lilicon hl-${navItem.icon}-icon m-r-10`} />
                    <span className="nav-text">{t(navItem.text)}</span>
                  </NavLink>
                </li>
              ))}
            </ul>

          </nav>

          <NavDropdown />
        </div>

        <SubNav setSidebar={this.props.setSidebar} />
      </div>
    );
  }
}

export default translate(['shared', 'nav'])(Nav);
