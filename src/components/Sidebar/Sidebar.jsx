import React, { Component } from 'react';

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
      sidebar: null
    };
  }

  closeSidebar = () => {
    this.setState({ sidebar: null });
  }

  render() {
    const { sidebar } = this.state;

    // Dynamically decide what form to load.
    const Form = sidebar ? Forms[sidebar] : null;

    return (
      <div className={`sidebar${sidebar ? ' slide' : ''}`}>
        {sidebar &&
          <div>
            <div className="sidebar-header">
              <button onClick={this.closeSidebar} className="close-btn">
                <i className="lilicon hl-close-icon" />
              </button>
            </div>
            <div className="sidebar-content">
              This is the {sidebar} sidebar

              <Form />
            </div>
          </div>
        }
      </div>
    );
  }
}

export default Sidebar;
