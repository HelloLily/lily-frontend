import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import AccountForm from 'pages/AccountForm';
import ContactForm from 'pages/ContactForm';
import DealForm from 'pages/DealForm';
import CaseForm from 'pages/CaseForm';

const Forms = {
  account: AccountForm,
  contact: ContactForm,
  deal: DealForm,
  case: CaseForm
};

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sidebar: null,
      expanded: false
    };
  }

  closeSidebar = () => {
    this.setState({ sidebar: null, expanded: false });
  };

  expandSidebar = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    const { sidebar, expanded } = this.state;

    // Dynamically decide what form to load.
    const Form = sidebar ? Forms[sidebar] : null;

    const className = cx('sidebar', {
      slide: sidebar,
      expanded: expanded
    });

    return (
      <div className={className}>
        {sidebar && (
          <React.Fragment>
            <div className="sidebar-header">
              <button onClick={this.closeSidebar} className="close-btn">
                <i className="lilicon hl-close-icon" />
              </button>

              <button onClick={this.expandSidebar} className="hl-interface-btn">
                <FontAwesomeIcon icon="expand-alt" />
              </button>
            </div>
            <div className="sidebar-content">
              <Form closeSidebar={this.closeSidebar} />
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default Sidebar;
