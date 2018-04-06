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
}

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sidebar: null
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      sidebar: nextProps.sidebar
    });
  }

  render() {
    const { sidebar } = this.state;

    let className = 'sidebar';

    if (sidebar) {
      // Apply a slide animation to the sidebar.
      className += ' slide';
    }

    // Dynamically decide what form to load.
    const Form = sidebar ? Forms[sidebar] : null;

    return (
      <div className={className}>
        {sidebar &&
          <div>
            <div className="sidebar-header">
              <button onClick={() => this.setState({sidebar: null})}>X</button>
            </div>
            This is the {sidebar} sidebar

            <Form />
          </div>
        }
      </div>
    );
  }
}

export default Sidebar;
