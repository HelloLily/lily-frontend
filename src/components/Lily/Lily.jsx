import React, { Component, Fragment } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import ErrorBoundry from '../ErrorBoundry';
import Header from '../Header';
import Breadcrumbs from '../Breadcrumbs';
import Nav from '../Nav';
import Sidebar from '../Sidebar';
import Dashboard from 'pages/Dashboard';
import Login from 'pages/Login';
import Accounts from 'pages/Accounts';
import Cases from 'pages/Cases';
import Contacts from 'pages/Contacts';
import Deals from 'pages/Deals';
import NotFound from 'pages/NotFound';
// import history from '../../utils/history';
// import { get } from '../../lib/api/';

import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faPhone from '@fortawesome/fontawesome-free-solid/faPhone';
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus';
import faLock from '@fortawesome/fontawesome-free-solid/faLock';
import faKey from '@fortawesome/fontawesome-free-solid/faKey';
import faRocket from '@fortawesome/fontawesome-free-solid/faRocket';
import faEnvelopeOpen from '@fortawesome/fontawesome-free-solid/faEnvelopeOpen';
import faCode from '@fortawesome/fontawesome-free-solid/faCode';
import faPlug from '@fortawesome/fontawesome-free-solid/faPlug';
import faCreditCard from '@fortawesome/fontawesome-free-solid/faCreditCard';
import faTrophy from '@fortawesome/fontawesome-free-solid/faTrophy';
import faSignOutAlt from '@fortawesome/fontawesome-free-solid/faSignOutAlt';

fontawesome.library.add(
  faPhone, faPlus, faLock, faKey, faRocket, faEnvelopeOpen,
  faCode, faPlug, faCreditCard, faTrophy, faSignOutAlt
);

class Lily extends Component {
  constructor(props) {
    super(props);

    this.state = { loading: true, data: undefined, sidebar: null };
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    this.setState({ loading: true });

    Promise.resolve().then(() => {
      this.setState({ data: {}, loading: false });
    });
  };

  setSidebar = type => {
    this.setState({sidebar: type});
  }

  render() {
    const { loading, sidebar } = this.state;

    if (loading) {
      return <div>Loading</div>;
    }

    return (
      <div className="lily">
        <Switch>
          <Route path="/login" exact>
            <ErrorBoundry>
              <Login handler={this.getData} />
            </ErrorBoundry>
          </Route>

          <Route path="*">
            <Fragment>
              <div className="column">
                <ErrorBoundry>
                  <Nav setSidebar={this.setSidebar} />
                </ErrorBoundry>
              </div>
              <div className="column">
                <ErrorBoundry>
                  <Header />
                </ErrorBoundry>
                <ErrorBoundry>
                  <Breadcrumbs />
                </ErrorBoundry>
                <main className="content">
                  <ErrorBoundry>
                    <Switch>
                      <Route path="/accounts" component={Accounts} />
                      <Route path="/contacts" component={Contacts} />
                      <Route path="/deals" component={Deals} />
                      <Route path="/cases" component={Cases} />
                      <Route path="/" component={Dashboard} />
                      <Redirect from="/" to="/" exact />
                      <Route path="*" component={NotFound} />
                    </Switch>
                  </ErrorBoundry>
                </main>

                <Sidebar sidebar={sidebar} />
              </div>
            </Fragment>
          </Route>
        </Switch>
      </div>
    );
  }
}

Lily.propTypes = {};

export default Lily;
