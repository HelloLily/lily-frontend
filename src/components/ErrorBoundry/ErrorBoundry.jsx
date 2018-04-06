import React, { Component } from 'react';
import { node } from 'prop-types';
import ErrorMessage from './ErrorMessage';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    console.log(error, info);
    this.setState({ hasError: true });
  }

  render() {
    return this.state.hasError ? <ErrorMessage /> : this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: node.isRequired
};

export default ErrorBoundary;
