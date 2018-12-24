import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withNamespaces } from 'react-i18next';

import withContext from 'src/withContext';
import { infoToast } from 'utils/toasts';
import ObjectLimit from 'components/Billing/ObjectLimit';
import Account from 'models/Account';
import Call from 'models/Call';
import NavDropdown from './NavDropdown';

class Nav extends Component {
  constructor(props) {
    super(props);

    this.navRef = React.createRef();
  }

  getLatestCall = async () => {
    const { history, t } = this.props;

    const { call } = await Call.latestCall();

    if (call) {
      const phoneNumber = call.caller.number;
      // There was a call for the current user
      // so try to find an account or contact with the given number.
      const { data } = await Account.query({ search: phoneNumber });

      if (data) {
        if (data.account) {
          // Account found so redirect to the account.
          history.push(`/accounts/${data.account.id}`);
        } else if (data.contact) {
          // Contact found so redirect to the contact.
          history.push(`/contacts/${data.account.id}`);
        } else {
          const formData = {
            phoneNumber,
            name: call.caller.name
          };
          // No account or contact found so redirect to the account form.
          history.push(`/accounts/create`, formData);
        }

        // Track clicking on the caller info button in Segment.
        window.analytics.track('caller-info-click', {
          phone_number: phoneNumber
        });
      }
    } else {
      infoToast(t('noCalls'));
    }
  };

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
                <NavLink to="/email">
                  <i className="lilicon hl-email-icon m-r-10" />
                  <span className="nav-text">Email</span>
                </NavLink>
              </li>

              <li className="m-r-55">
                <NavLink to="/accounts">
                  <i className="lilicon hl-company-icon m-r-10" />
                  <span className="nav-text">Accounts</span>
                </NavLink>
              </li>

              <li className="m-r-55">
                <NavLink to="/contacts">
                  <i className="lilicon hl-entity-icon m-r-10" />
                  <span className="nav-text">Contacts</span>
                </NavLink>
              </li>

              <li className="m-r-55">
                <NavLink to="/deals">
                  <i className="lilicon hl-deals-icon m-r-10" />
                  <span className="nav-text">Deals</span>
                </NavLink>
              </li>

              <li className="m-r-55">
                <NavLink to="/cases">
                  <i className="lilicon hl-case-icon m-r-10" />
                  <span className="nav-text">Cases</span>
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="nav-add-buttons">
            <button className="hl-primary-btn m-r-5" onClick={this.getLatestCall}>
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

export default withNamespaces('toasts')(withRouter(withContext(Nav)));
