import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

import i18n from './lib/i18n';
import './sass/styles.scss';
import ErrorBoundary from './components/ErrorBoundary';
import Lily from './components/Lily';
import history from './utils/history';
import AppStore from './AppStore';

render(
  <ErrorBoundary>
    <I18nextProvider i18n={i18n}>
      <Router history={history}>
        <AppStore>
          <Lily />
        </AppStore>
      </Router>
    </I18nextProvider>
  </ErrorBoundary>,
  document.getElementById('app')
);
