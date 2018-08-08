/* eslint react/no-unused-state: 0 */
import React, { Component } from 'react';

import { AppContext } from './withContext';

class AppStore extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sidebar: null,
      data: {},
      currentUser: {},
      setSidebar: this.setSidebar,
      setCurrentUser: this.setCurrentUser
    };
  }

  setCurrentUser = user => {
    this.setState({ currentUser: user });
  };

  setSidebar = (type, data = null) => {
    const newState = { sidebar: type };

    if (data) {
      newState.data = data;
    }

    this.setState(newState);
  };

  render() {
    return <AppContext.Provider value={this.state}>{this.props.children}</AppContext.Provider>;
  }
}

export default AppStore;
