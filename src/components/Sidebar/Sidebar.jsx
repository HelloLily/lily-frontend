import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import withContext from 'src/withContext';

const AccountForm = React.lazy(() => import('pages/AccountForm'));
const ContactForm = React.lazy(() => import('pages/ContactForm'));
const DealForm = React.lazy(() => import('pages/DealForm'));
const CaseForm = React.lazy(() => import('pages/CaseForm'));

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
      expanded: false
    };
  }

  static getDerivedStateFromProps = nextProps => ({
    sidebar: nextProps.sidebar,
    setSidebar: nextProps.setSidebar
  });

  closeSidebar = () => {
    this.state.setSidebar(null);
    this.setState({ expanded: false });
  };

  expandSidebar = () => {
    const { expanded } = this.state;

    this.setState({ expanded: !expanded });
  };

  render() {
    const { sidebar, expanded } = this.state;

    // Dynamically decide what form to load.
    const FormComponent = sidebar ? Forms[sidebar] : null;

    const className = cx('sidebar', {
      slide: sidebar,
      expanded
    });

    return (
      <div className={className}>
        {sidebar && (
          <React.Suspense fallback={<div />}>
            <div className="sidebar-header">
              <button onClick={this.closeSidebar} className="close-btn">
                <i className="lilicon hl-close-icon" />
              </button>

              <button onClick={this.expandSidebar} className="hl-interface-btn">
                <FontAwesomeIcon icon="expand-alt" />
              </button>
            </div>
            <div className="sidebar-content">
              <FormComponent closeSidebar={this.closeSidebar} />
            </div>
          </React.Suspense>
        )}
      </div>
    );
  }
}

export default withContext(Sidebar);
