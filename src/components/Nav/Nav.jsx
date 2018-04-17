import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { translate } from 'react-i18next';
import navItems from 'src/config/nav.json';

import NavDropdown from './NavDropdown';
import SubNav from './SubNav';

class Nav extends Component {
  constructor(props) {
    super(props);

    this.navRef = React.createRef();
  }

  render() {
    const { t } = this.props;

    return (
      <div className="navbar">
        <div className="main-nav">
          <nav ref={this.navRef}>
            <ul className="main-nav-links">
              <li>
                <NavLink to="/" exact className="m-l-20 m-r-40">
                  <i className="lilicon hl-lily-icon" />
                </NavLink>
              </li>

              {navItems.map(navItem => (
                <li key={navItem.text} className="m-r-55">
                  <NavLink to={navItem.link} exact>
                    <i className={`lilicon hl-${navItem.icon}-icon m-r-10`} />
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
