import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import getColorCode from 'utils/getColorCode';
import EmailAccount from 'models/EmailAccount';
import Settings from 'models/Settings';
import EmailCompose from 'pages/EmailCompose';
import EmailDetail from 'pages/EmailDetail';
import EmailAccounts from 'components/EmailAccounts';
import EmailMessages from 'components/EmailMessages';

class Inbox extends Component {
  constructor(props) {
    super(props);

    this.settings = new Settings('inbox');

    this.state = { loading: true, label: null };
  }

  async componentDidMount() {
    // TODO: Temporary until the email message's account fields includes color.
    const colorCodes = {};
    // TODO: Fetch settings for label.
    const labelSettings = {};

    const settingsRequest = await this.settings.get();

    const settings = { ...settingsRequest.results };

    let initialAccount = null;

    const accountRequest = await EmailAccount.mine();
    // TODO: This should be accountRequest.results once the API is changed.`
    const emailAccounts = accountRequest.map(emailAccount => {
      // Hide labels provided by the email provider.
      emailAccount.labels = emailAccount.labels.filter(label => label.labelType !== 0);

      const color = emailAccount.color || getColorCode(emailAccount.emailAddress);

      colorCodes[emailAccount.id] = color;

      // Sort the labels by name.
      emailAccount.labels = emailAccount.labels.sort((a, b) => a.name.localeCompare(b.name));

      const labelList = [];
      let previousLabel = null;

      emailAccount.labels.forEach(label => {
        label.children = [];

        // Get stored settings for the label.
        label.collapsed = labelSettings[label.id] || false;

        if (!label.parent) {
          // Initial indentation level.
          label.level = 0;
        }

        let addToList = true;

        if (previousLabel) {
          const parent = this.getParent(previousLabel, label);

          if (parent) {
            // Increase indentation level.
            label.level = parent.level + 1;
            parent.children.push(label);
            // It's a child, so don't render it as part of the list,
            // but part of the parent.
            addToList = false;
          }
        }

        previousLabel = label;

        if (addToList) {
          labelList.push(label);
        }
      });

      emailAccount.labels = labelList;

      if (emailAccount.id === settings.emailAccount) {
        initialAccount = emailAccount;
      }

      return emailAccount;
    });

    // TODO: Load previous label from database.
    this.setState({
      ...settings,
      colorCodes,
      emailAccount: initialAccount,
      emailAccounts,
      loading: false
    });
  }

  getParentLabelName = label => {
    let name = '';

    if (label.parent) {
      name = this.getParentLabelName(label.parent);
    }

    name += `${label.name}/`;

    return name;
  };

  getParent = (parentLabel, label) => {
    const parentLabelName = this.getParentLabelName(parentLabel);

    let parent;

    if (label.name.includes(parentLabelName)) {
      // We've reached the final parent and it seems the label is a child.
      parent = parentLabel;
      label.name = label.name.replace(parentLabelName, '');
    } else if (parentLabel.parent) {
      // The given parentLabel doesn't seem to be the label's parent.
      // So recursively check if the given parent's parent is the label's parent.
      parent = this.getParent(parentLabel.parent, label);
    }

    if (parent) {
      label.parent = parent;
    }

    return parent;
  };

  setInbox = (emailAccount, label) => {
    const data = {
      emailAccount: emailAccount ? emailAccount.id : null,
      label: {
        id: label.id || null,
        labelId: label.labelId,
        name: label.name
      }
    };

    this.settings.store(data).then(() => {
      this.setState({ emailAccount, label });
      this.props.history.push('/email');
    });
  };

  render() {
    const { emailAccounts, colorCodes, emailAccount, label, loading } = this.state;

    return (
      <div className="inbox">
        {!loading ? (
          <React.Fragment>
            <div className="email-accounts m-r-15">
              <button className="hl-primary-btn-green w-100 m-b-15">
                <i className="lilicon hl-email-icon m-r-5" /> Compose
              </button>

              <EmailAccounts
                emailAccount={emailAccount}
                emailAccounts={emailAccounts}
                label={label}
                setInbox={this.setInbox}
              />
            </div>

            <div className="w-100">
              <Switch>
                <Route path="/email/compose" component={EmailCompose} />
                <Route path="/email/:id" component={EmailDetail} />

                <Route
                  path="/email"
                  render={() => (
                    <EmailMessages
                      colorCodes={colorCodes}
                      emailAccount={emailAccount}
                      label={label}
                    />
                  )}
                />
              </Switch>
            </div>
          </React.Fragment>
        ) : (
          <div className="inbox-loading">
            <div className="loading-header m-l-10">
              Loading your inbox
              <div className="text-center m-t-10">
                <FontAwesomeIcon icon="spinner" spin />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Inbox;
