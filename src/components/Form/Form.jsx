import React, { Component } from 'react';

import { ENTER_KEY } from 'lib/constants';

class Form extends Component {
  componentDidMount() {
    document.addEventListener('keydown', this.handleEvent);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleEvent);
  }

  handleEvent = event => {
    if (event.metaKey && event.keyCode === ENTER_KEY) {
      this.props.handleSubmit(event);
    }
  };

  render() {
    return <form>{this.props.children}</form>;
  }
}

export default Form;
