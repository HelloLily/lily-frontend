import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { translate } from 'react-i18next';
import navItems from 'src/config/nav.json';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import ObjectLimit from 'components/Billing/ObjectLimit';
import NavDropdown from './NavDropdown';

class Nav extends Component {
  constructor(props) {
    super(props);

    this.navRef = React.createRef();
  }

  setSidebar = type => {
    this.props.sidebarRef.current.setState({ sidebar: type });
  };

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

          <div className="nav-add-buttons">
            <button className="hl-primary-btn m-r-5">
              <FontAwesomeIcon icon="phone" flip="horizontal" /> Caller info
            </button>

            <ObjectLimit model="accounts">
              <button className="hl-primary-btn" onClick={() => this.setSidebar('account')}>
                <FontAwesomeIcon icon="plus" /> Account
              </button>
            </ObjectLimit>

            <ObjectLimit model="contacts">
              <button className="hl-primary-btn" onClick={() => this.setSidebar('contact')}>
                <FontAwesomeIcon icon="plus" /> Contact
              </button>
            </ObjectLimit>

            <button className="hl-primary-btn" onClick={() => this.setSidebar('deal')}>
              <FontAwesomeIcon icon="plus" /> Deal
            </button>

            <button className="hl-primary-btn" onClick={() => this.setSidebar('case')}>
              <FontAwesomeIcon icon="plus" /> Case
            </button>
          </div>

          <NavDropdown />
        </div>
      </div>
    );
  }
}

export default translate(['shared', 'nav'])(Nav);
