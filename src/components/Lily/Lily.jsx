import React, { Component, Fragment } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { ToastContainer, cssTransition } from 'react-toastify';

import ErrorBoundry from 'components/ErrorBoundry';
import withContext from 'src/withContext';
import Notifications from 'lib/Notifications';
import Nav from 'components/Nav';
import Sidebar from 'components/Sidebar';
import Dashboard from 'pages/Dashboard';
import Login from 'pages/Login';
import Inbox from 'pages/Inbox';
import Preferences from 'pages/Preferences';
import AccountForm from 'pages/AccountForm';
import AccountDetail from 'pages/AccountDetail';
import AccountList from 'pages/AccountList';
import ContactForm from 'pages/ContactForm';
import ContactDetail from 'pages/ContactDetail';
import ContactList from 'pages/ContactList';
import DealForm from 'pages/DealForm';
import DealDetail from 'pages/DealDetail';
import DealList from 'pages/DealList';
import PandaDocCreate from 'pages/PandaDocCreate';
import CaseForm from 'pages/CaseForm';
import CaseDetail from 'pages/CaseDetail';
import CaseList from 'pages/CaseList';
import NotFound from 'pages/NotFound';
import Tenant from 'models/Tenant';
import User from 'models/User';
import './icons';
// import history from '../../utils/history';
// import { get } from '../../lib/api/';

const Fade = cssTransition({
  enter: 'fade-in',
  exit: 'fade-out',
  appendPosition: false
});

class Lily extends Component {
  constructor(props) {
    super(props);

    this.state = { loading: true };
  }

  async componentDidMount() {
    const currentUser = await User.me();
    const objectCountResponse = await Tenant.objectCounts();

    currentUser.objectCounts = { ...objectCountResponse.results };

    this.props.setCurrentUser(currentUser);

    // TODO: Implement a way to switch between test and live site.
    window.Intercom('boot', {
      app_id: process.env.INTERCOM_APP_ID,
      user_id: currentUser.id,
      name: currentUser.fullName,
      email: currentUser.email,
      company: {
        name: currentUser.company,
        id: currentUser.tenant.id
      },
      widget: {
        activator: '#IntercomDefaultWidget'
      },
      user_hash: currentUser.userHash
    });

    Notifications.init();

    // Load Segment.
    window.analytics.load(process.env.SEGMENT_WRITE_KEY);

    this.props.history.listen(location => {
      // Display any new Intercom messages for the current user.
      window.Intercom('update');

      // Track a page event in Segment every time a new page is visited.
      // analytics.page({
      //   path: path,
      //   referrer: referrer,
      // });
      window.analytics.page({
        path: location.pathname,
        url: window.location.href
      });

      const { billing } = currentUser.tenant;

      // Identify a user in Segment when the nagivate to a different page.
      window.analytics.identify(currentUser.id, {
        name: currentUser.fullName,
        email: currentUser.email,
        tenant_id: currentUser.tenant.id,
        tenant_name: currentUser.tenant.name,
        plan_id: billing.plan ? billing.plan.id : '',
        plan_tier: billing.plan ? billing.plan.tier : '',
        plan_name: billing.plan ? billing.plan.name : '',
        is_free_plan: billing ? billing.isFreePlan : ''
      });
    });

    this.setState({ loading: false });
  }

  render() {
    const { loading } = this.state;

    if (loading) {
      return (
        <div className="column">
          <ErrorBoundry>
            <Nav />
          </ErrorBoundry>
        </div>
      );
    }

    return (
      <div className="lily">
        <Switch>
          <Route path="/login" exact>
            <ErrorBoundry>
              <Login />
            </ErrorBoundry>
          </Route>

          <Route path="*">
            <Fragment>
              <div className="column">
                <ErrorBoundry>
                  <Nav />
                </ErrorBoundry>
              </div>
              <div className="main">
                <main className="content" id="content">
                  <ErrorBoundry>
                    <Switch>
                      <Route path="/email" component={Inbox} />

                      <Route path="/preferences/*" component={Preferences} />

                      <Route path="/accounts/create" component={AccountForm} />
                      <Route path="/accounts/:id/edit" component={AccountForm} />
                      <Route path="/accounts/:id" component={AccountDetail} />
                      <Route path="/accounts" component={AccountList} />

                      <Route path="/contacts/create" component={ContactForm} />
                      <Route path="/contacts/:id/edit" component={ContactForm} />
                      <Route path="/contacts/:id" component={ContactDetail} />
                      <Route path="/contacts" component={ContactList} />

                      <Route path="/deals/create" component={DealForm} />
                      <Route path="/deals/:id/edit" component={DealForm} />
                      <Route path="/deals/:id" component={DealDetail} />
                      <Route path="/deals" component={DealList} />
                      <Route path="/quotes/create/:id" component={PandaDocCreate} />

                      <Route path="/cases/create" component={CaseForm} />
                      <Route path="/cases/:id/edit" component={CaseForm} />
                      <Route path="/cases/:id" component={CaseDetail} />
                      <Route path="/cases" component={CaseList} />

                      <Route path="/" component={Dashboard} />
                      <Redirect from="/" to="/" exact />
                      <Route path="*" component={NotFound} />
                    </Switch>
                  </ErrorBoundry>
                </main>
                <Sidebar />

                <ToastContainer hideProgressBar transition={Fade} />
              </div>
            </Fragment>
          </Route>
        </Switch>
      </div>
    );
  }
}

Lily.propTypes = {};

export default withRouter(withContext(Lily));
