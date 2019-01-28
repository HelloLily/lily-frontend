import React, { Component } from 'react';
import * as Sentry from '@sentry/browser';

import ErrorMessage from './ErrorMessage';

Sentry.init({
  dsn: process.env.SENTRY_DSN
});

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line
    console.log(error, info);

    this.setState({ hasError: true });

    Sentry.withScope(scope => {
      Object.keys(info).forEach(key => {
        scope.setExtra(key, info[key]);
      });

      Sentry.captureException(error);
    });
  }

  render() {
    return this.state.hasError ? <ErrorMessage /> : this.props.children;
  }
}

export default ErrorBoundary;
