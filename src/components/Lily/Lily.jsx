import React, { Component, Fragment } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import fontawesome from '@fortawesome/fontawesome';
import faPhone from '@fortawesome/fontawesome-free-solid/faPhone';
import faMobile from '@fortawesome/fontawesome-free-solid/faMobile';
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus';
import faLock from '@fortawesome/fontawesome-free-solid/faLock';
import faKey from '@fortawesome/fontawesome-free-solid/faKey';
import faRocket from '@fortawesome/fontawesome-free-solid/faRocket';
import faEnvelope from '@fortawesome/fontawesome-free-solid/faEnvelope';
import faEnvelopeOpen from '@fortawesome/fontawesome-free-solid/faEnvelopeOpen';
import faCode from '@fortawesome/fontawesome-free-solid/faCode';
import faPlug from '@fortawesome/fontawesome-free-solid/faPlug';
import faCreditCard from '@fortawesome/fontawesome-free-solid/faCreditCard';
import faTrophy from '@fortawesome/fontawesome-free-solid/faTrophy';
import faSignOutAlt from '@fortawesome/fontawesome-free-solid/faSignOutAlt';
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck';
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes';
import faColumns from '@fortawesome/fontawesome-free-solid/faColumns';
import faStar from '@fortawesome/fontawesome-free-solid/faStar';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';
import faReply from '@fortawesome/fontawesome-free-solid/faReply';
import faReplyAll from '@fortawesome/fontawesome-free-solid/faReplyAll';
import faArrowRight from '@fortawesome/fontawesome-free-solid/faArrowRight';
import faArchive from '@fortawesome/fontawesome-free-solid/faArchive';
import faFolder from '@fortawesome/fontawesome-free-solid/faFolder';

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
// import history from '../../utils/history';
// import { get } from '../../lib/api/';

fontawesome.library.add(
  faPhone, faMobile, faPlus, faLock, faKey, faRocket, faEnvelope, faEnvelopeOpen,
  faCode, faPlug, faCreditCard, faTrophy, faSignOutAlt, faCheck, faTimes, faColumns,
  faStar, faSpinner, faReply, faReplyAll, faArrowRight, faArchive, faFolder
);

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
