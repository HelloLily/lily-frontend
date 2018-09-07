import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import withContext from 'src/withContext';
import ObjectLimit from 'components/Billing/ObjectLimit';
import NavDropdown from './NavDropdown';

class Nav extends Component {
  constructor(props) {
    super(props);

    this.navRef = React.createRef();
  }

  render() {
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

              <li className="m-r-55">
                <NavLink to="/" exact>
                  <i className="lilicon hl-dashboard-icon m-r-10" />
                  <span className="nav-text">Dashboard</span>
                </NavLink>
              </li>

              <li className="m-r-55">
                <NavLink to="/email" exact>
                  <i className="lilicon hl-email-icon m-r-10" />
                  <span className="nav-text">Email</span>
                </NavLink>
              </li>

              <li className="m-r-55">
                <NavLink to="/accounts" exact>
                  <i className="lilicon hl-company-icon m-r-10" />
                  <span className="nav-text">Accounts</span>
                </NavLink>
              </li>

              <li className="m-r-55">
                <NavLink to="/contacts" exact>
                  <i className="lilicon hl-entity-icon m-r-10" />
                  <span className="nav-text">Contacts</span>
                </NavLink>
              </li>

              <li className="m-r-55">
                <NavLink to="/deals" exact>
                  <i className="lilicon hl-deals-icon m-r-10" />
                  <span className="nav-text">Deals</span>
                </NavLink>
              </li>

              <li className="m-r-55">
                <NavLink to="/cases" exact>
                  <i className="lilicon hl-case-icon m-r-10" />
                  <span className="nav-text">Cases</span>
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="nav-add-buttons">
            <button className="hl-primary-btn m-r-5">
              <FontAwesomeIcon icon="phone" flip="horizontal" /> Caller info
            </button>

            <ObjectLimit model="accounts">
              <button className="hl-primary-btn" onClick={() => this.props.setSidebar('account')}>
                <FontAwesomeIcon icon="plus" /> Account
              </button>
            </ObjectLimit>

            <ObjectLimit model="contacts">
              <button className="hl-primary-btn" onClick={() => this.props.setSidebar('contact')}>
                <FontAwesomeIcon icon="plus" /> Contact
              </button>
            </ObjectLimit>

            <button className="hl-primary-btn" onClick={() => this.props.setSidebar('deal')}>
              <FontAwesomeIcon icon="plus" /> Deal
            </button>

            <button className="hl-primary-btn" onClick={() => this.props.setSidebar('case')}>
              <FontAwesomeIcon icon="plus" /> Case
            </button>
          </div>

          <NavDropdown />
        </div>
      </div>
    );
  }
}

export default withContext(Nav);
