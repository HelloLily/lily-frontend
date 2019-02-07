import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import LoadingIndicator from 'components/Utils/LoadingIndicator';
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
      expanded: window.innerWidth < 1550
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
      expanded: expanded && sidebar
    });

    return (
      <div className={className}>
        {sidebar && (
          <React.Suspense fallback={<LoadingIndicator />}>
            <div className="sidebar-header">
              <button onClick={this.closeSidebar} className="hl-interface-btn close-btn">
                <FontAwesomeIcon icon={['far', 'times']} />
              </button>

              <button onClick={this.expandSidebar} className="hl-interface-btn">
                <FontAwesomeIcon icon={['far', 'expand-alt']} />
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
