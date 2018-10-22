import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';

import EmailAccount from 'models/EmailAccount';
import Settings from 'models/Settings';
import EmailCompose from 'pages/EmailCompose';
import EmailDetail from 'pages/EmailDetail';
import LoadingIndicator from 'components/Utils/LoadingIndicator';
import EmailAccounts from 'components/EmailAccounts';
import EmailMessages from 'components/EmailMessages';

class Inbox extends Component {
  constructor(props) {
    super(props);

    this.settings = new Settings('inbox');

    this.state = {
      currentEmailAccount: null,
      currentLabel: null,
      loading: true
    };

    document.title = 'Email - Lily';
  }

  async componentDidMount() {
    const settingsRequest = await this.settings.get();
    const settings = { ...settingsRequest.results };

    let initialAccount = null;

    if (settings.currentEmailAccount) {
      const accountRequest = await EmailAccount.get(settings.currentEmailAccount);

      initialAccount = accountRequest;
    }

    // TODO: Load previous label from database.
    this.setState({
      ...settings,
      currentEmailAccount: initialAccount,
      loading: false
    });
  }

  setInbox = (emailAccount, label) => {
    let currentEmailAccount = emailAccount ? emailAccount.id : null;

    const data = {
      currentEmailAccount,
      currentLabel: {
        id: label.id || null,
        labelId: label.labelId,
        name: label.name
      }
    };

    this.settings.store(data).then(async () => {
      if (emailAccount) {
        const emailAccountResponse = await EmailAccount.get(currentEmailAccount);

        currentEmailAccount = emailAccountResponse;
      }

      this.setState({ currentEmailAccount, currentLabel: label });
      this.props.history.push('/email');
    });
  };

  render() {
    const { currentEmailAccount, currentLabel, loading } = this.state;

    return (
      <div className="inbox">
        {!loading ? (
          <React.Fragment>
            <div className="email-accounts m-r-15">
              <Link to="/email/compose/" className="hl-primary-btn-green w-100 m-b-15">
                <i className="lilicon hl-email-icon m-r-5" /> Compose
              </Link>

              <EmailAccounts
                currentEmailAccount={currentEmailAccount}
                currentLabel={currentLabel}
                setInbox={this.setInbox}
              />
            </div>

            <div className="w-100">
              <Switch>
                <Route path="/email/compose" component={EmailCompose} />
                <Route
                  path="/email/:id"
                  render={() => (
                    <EmailDetail
                      currentEmailAccount={currentEmailAccount}
                      currentLabel={currentLabel}
                    />
                  )}
                />

                <Route
                  path="/email"
                  render={() => (
                    <EmailMessages
                      currentEmailAccount={currentEmailAccount}
                      currentLabel={currentLabel}
                    />
                  )}
                />
              </Switch>
            </div>
          </React.Fragment>
        ) : (
          <LoadingIndicator>Loading your inbox</LoadingIndicator>
        )}
      </div>
    );
  }
}

export default Inbox;
