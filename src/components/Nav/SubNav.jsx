import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { translate } from 'react-i18next';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

class SubNav extends Component {
  setSidebar = type => {
    this.props.sidebarRef.current.setState({sidebar: type});
  }

  render() {
    const { t } = this.props;

    return (
      <div className="subnav">
        <div className="subnav-inner">
          <div className="page-name">
            Page header
          </div>
          <div>
            <button className="hl-primary-btn m-r-5"><FontAwesomeIcon icon="phone" flip="horizontal" /> Caller info</button>
            <button className="hl-primary-btn m-r-5" onClick={() => this.setSidebar('account')}><FontAwesomeIcon icon="plus" /> Account</button>
            <button className="hl-primary-btn m-r-5" onClick={() => this.setSidebar('contact')}><FontAwesomeIcon icon="plus" /> Contact</button>
            <button className="hl-primary-btn m-r-5" onClick={() => this.setSidebar('deal')}><FontAwesomeIcon icon="plus" /> Deal</button>
            <button className="hl-primary-btn" onClick={() => this.setSidebar('case')}><FontAwesomeIcon icon="plus" /> Case</button>
          </div>
        </div>
      </div>
    );
  }
}

export default translate(['shared', 'subnav'])(SubNav);
