import React, { Component, Fragment } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { ToastContainer, cssTransition } from 'react-toastify';

import ErrorBoundary from 'components/ErrorBoundary';
import withContext from 'src/withContext';
import Notifications from 'lib/Notifications';
import Nav from 'components/Nav';
import LoadingIndicator from 'components/Utils/LoadingIndicator';
import Sidebar from 'components/Sidebar';
import Login from 'pages/Login';
import Tenant from 'models/Tenant';
import User from 'models/User';
import './icons';

const Dashboard = React.lazy(() => import('pages/Dashboard'));
const Inbox = React.lazy(() => import('pages/Inbox'));
const Preferences = React.lazy(() => import('pages/Preferences'));
const AccountForm = React.lazy(() => import('pages/AccountForm'));
const AccountDetail = React.lazy(() => import('pages/AccountDetail'));
const AccountList = React.lazy(() => import('pages/AccountList'));
const ContactForm = React.lazy(() => import('pages/ContactForm'));
const ContactDetail = React.lazy(() => import('pages/ContactDetail'));
const ContactList = React.lazy(() => import('pages/ContactList'));
const DealForm = React.lazy(() => import('pages/DealForm'));
const DealDetail = React.lazy(() => import('pages/DealDetail'));
const DealList = React.lazy(() => import('pages/DealList'));
const CaseForm = React.lazy(() => import('pages/CaseForm'));
const CaseDetail = React.lazy(() => import('pages/CaseDetail'));
const CaseList = React.lazy(() => import('pages/CaseList'));
const PandaDocCreate = React.lazy(() => import('pages/PandaDocCreate'));
const NotFound = React.lazy(() => import('pages/NotFound'));

const Fade = cssTransition({
  enter: 'fade-in',
  exit: 'fade-out',
  appendPosition: false
});

class Lily extends Component {
  constructor(props) {
    super(props);

    this.previousPage = '';

    this.state = { loading: true };
  }

  async componentDidMount() {
    const currentUser = await User.me();
    const tenantInfoResponse = await Tenant.info();
    const tenantInfo = tenantInfoResponse.results;

    currentUser.objectCounts = { ...tenantInfo.objectCounts };
    currentUser.limitReached = tenantInfo.limitReached ? { ...tenantInfo.limitReached } : null;
    currentUser.tenant.trialRemaining = tenantInfo.trialRemaining;
    currentUser.tenant.admin = tenantInfo.admin;
    currentUser.isFreePlan = currentUser.tenant.billing.isFreePlan;

    this.props.setCurrentUser(currentUser);

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

    if (!process.env.DEBUG) {
      // Load Segment.
      window.analytics.load(process.env.SEGMENT_WRITE_KEY);
    }

    this.props.history.listen(location => {
      // Display any new Intercom messages for the current user.
      window.Intercom('update');

      // Track a page event in Segment every time a new page is visited.
      window.analytics.page({
        path: location.pathname,
        url: window.location.href,
        referrer: this.previousPage
      });

      this.previousPage = window.location.href;

      const { billing } = currentUser.tenant;

      // Identify a user in Segment when they nagivate to a different page.
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
          <ErrorBoundary>
            <Nav />
          </ErrorBoundary>
        </div>
      );
    }

    return (
      <div className="lily">
        <Switch>
          <Route path="/login" exact>
            <ErrorBoundary>
              <Login />
            </ErrorBoundary>
          </Route>

          <Route path="*">
            <Fragment>
              <div className="column">
                <ErrorBoundary>
                  <Nav />
                </ErrorBoundary>
              </div>
              <div className="main">
                <main className="content" id="content">
                  <ErrorBoundary>
                    <React.Suspense fallback={<LoadingIndicator />}>
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

                        <Route path="/404" component={NotFound} />
                        <Route path="/" component={Dashboard} />
                        <Redirect from="/" to="/" exact />
                        <Route path="*" component={NotFound} />
                      </Switch>
                    </React.Suspense>
                  </ErrorBoundary>
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
