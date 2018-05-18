import React, { Component, Fragment } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import ErrorBoundry from 'components/ErrorBoundry';
import Header from 'components/Header';
import Breadcrumbs from 'components/Breadcrumbs';
import Nav from 'components/Nav';
import Sidebar from 'components/Sidebar';
import Dashboard from 'pages/Dashboard';
import Login from 'pages/Login';
import Inbox from 'pages/Inbox';
import AccountList from 'pages/AccountList';
import AccountDetail from 'pages/AccountDetail';
import ContactList from 'pages/ContactList';
import ContactDetail from 'pages/ContactDetail';
import CaseList from 'pages/CaseList';
import CaseDetail from 'pages/CaseDetail';
import DealList from 'pages/DealList';
import DealDetail from 'pages/DealDetail';
import NotFound from 'pages/NotFound';
import './icons';
// import history from '../../utils/history';
// import { get } from '../../lib/api/';

class Lily extends Component {
  constructor(props) {
    super(props);

    this.sidebar = React.createRef();

    this.state = { loading: true, data: undefined };
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

  render() {
    const { loading } = this.state;

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
                  <Nav sidebarRef={this.sidebar} />
                </ErrorBoundry>
              </div>
              <div className="column">
                <ErrorBoundry>
                  <Header />
                </ErrorBoundry>
                <ErrorBoundry>
                  <Breadcrumbs />
                </ErrorBoundry>
                <main className="content" id="content">
                  <ErrorBoundry>
                    <Switch>
                      <Route path="/email" component={Inbox} />
                      <Route path="/accounts/:id" component={AccountDetail} />
                      <Route path="/accounts" component={AccountList} />
                      <Route path="/contacts/:id" component={ContactDetail} />
                      <Route path="/contacts" component={ContactList} />
                      <Route path="/deals/:id" component={DealDetail} />
                      <Route path="/deals" component={DealList} />
                      <Route path="/cases/:id" component={CaseDetail} />
                      <Route path="/cases" component={CaseList} />
                      <Route path="/" component={Dashboard} />
                      <Redirect from="/" to="/" exact />
                      <Route path="*" component={NotFound} />
                    </Switch>
                  </ErrorBoundry>
                </main>

                <Sidebar ref={this.sidebar} />
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
