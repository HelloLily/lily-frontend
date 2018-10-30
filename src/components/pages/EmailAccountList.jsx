import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withNamespaces } from 'react-i18next';

import withContext from 'src/withContext';
import ListActions from 'components/List/ListActions';
import BlockUI from 'components/Utils/BlockUI';
import UserShare from 'components/UserShare';
import LilyModal from 'components/LilyModal';
import User from 'models/User';
import SharedEmailConfig from 'models/SharedEmailConfig';
import EmailAccount from 'models/EmailAccount';

class EmailAccountList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      sharedAccounts: [],
      loading: true,
      modalOpen: false,
      selectedAccount: null,
      users: []
    };

    document.title = 'Email accounts';
  }

  async componentDidMount() {
    const { currentUser } = this.props;

    const ownedAccountsResponse = await EmailAccount.query({ owner: currentUser.id });
    const sharedAccountsResponse = await EmailAccount.query({
      sharedemailconfig__user__id: currentUser.id
    });
    const publicAccountsResponse = await EmailAccount.query({ privacy: EmailAccount.PUBLIC });

    const items = ownedAccountsResponse.results.map(emailAccount => {
      emailAccount.sharedEmailConfigs = emailAccount.sharedEmailConfigs.filter(
        config =>
          // Filter out the user's own configuration.
          config.user !== currentUser.id
      );

      return emailAccount;
    });
    // Merge the two arrays and filter out any email accounts belonging to the current user.
    const sharedAccounts = [
      ...sharedAccountsResponse.results,
      ...publicAccountsResponse.results
    ].filter(emailAccount => emailAccount.owner.id !== currentUser.id);

    this.setState({
      items,
      sharedAccounts,
      loading: false
    });
  }

  openSharedWithModal = async emailAccount => {
    const promises = emailAccount.sharedEmailConfigs.map(async config => {
      const user = await User.get(config.user);

      return user;
    });
    const users = await Promise.all(promises);

    this.setState({ modalOpen: true, selectedAccount: emailAccount, users });
  };

  closeSharedWithModal = () => {
    this.setState({ modalOpen: false, selectedAccount: null, users: [] });
  };

  toggleHidden = emailAccount => {
    const args = {
      emailAccount: emailAccount.id,
      user: this.props.currentUser.id,
      isHidden: emailAccount.isHidden
    };

    SharedEmailConfig.post(args);
  };

  setupEmailAccount = async () => {
    const response = await EmailAccount.setup();

    window.location = response.url;
  };

  hasFullAccess = emailAccount => {
    let fullAccess = false;

    if (emailAccount.privacy === EmailAccount.PUBLIC) {
      // An email account set to public is always open to everyone.
      fullAccess = true;
    } else if (emailAccount.sharedEmailConfigs.length > 0) {
      emailAccount.sharedEmailConfigs.forEach(config => {
        // Email account isn't public, but specific sharing setting could be public.
        if (config.user === this.props.currentUser.id && config.privacy === EmailAccount.PUBLIC) {
          fullAccess = true;
        }
      });
    }

    return fullAccess;
  };

  removeItem = item => {
    const { items } = this.state;

    const index = items.findIndex(iterItem => iterItem.id === item.id);
    items.splice(index, 1);

    this.setState({ items });
  };

  render() {
    const { items, sharedAccounts, loading, selectedAccount, users } = this.state;
    const { currentUser, t } = this.props;

    return (
      <BlockUI blocking={loading}>
        <div className="list">
          <div className="list-header">
            <div className="list-title flex-grow">Your email accounts</div>

            <button className="hl-primary-btn" onClick={this.setupEmailAccount}>
              <FontAwesomeIcon icon="plus" /> Email account
            </button>
          </div>
          <table className="hl-table">
            <thead>
              <tr>
                <th className="w-10">Primary</th>
                <th>Email address</th>
                <th className="w-15">Label</th>
                <th className="w-15">Privacy setting</th>
                <th className="w-10">Default email template</th>
                <th className="w-10">Subscribed</th>
                <th className="w-10">Shared with</th>
                <th className="w-10">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(emailAccount => (
                <tr key={emailAccount.id}>
                  <td>
                    <input type="radio" />
                  </td>
                  <td>{emailAccount.emailAddress}</td>
                  <td>{emailAccount.label}</td>
                  <td>{emailAccount.privacyDisplay}</td>
                  <td>{emailAccount.defaultTemplate ? emailAccount.defaultTemplate.name : '-'}</td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={!emailAccount.isHidden}
                        onChange={() => this.toggleHidden(emailAccount)}
                      />
                      <div className="slider round" />
                    </label>
                  </td>
                  <td>
                    {emailAccount.privacy !== EmailAccount.PUBLIC ? (
                      <button
                        className="hl-primary-btn"
                        onClick={() => this.openSharedWithModal(emailAccount)}
                      >
                        {emailAccount.sharedEmailConfigs.length}
                        <i className="lilicon hl-entity-icon m-l-5" />
                      </button>
                    ) : (
                      <span>All</span>
                    )}
                  </td>
                  <td>
                    <ListActions
                      item={emailAccount}
                      deleteCallback={this.removeItem}
                      {...this.props}
                    />
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td colSpan="8">{t('preferences.emailAccounts')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={`m-t-25${currentUser.tenant.isFreePlan ? ' is-disabled' : ''}`}>
          <div className="list">
            <div className="list-header">
              <div className="list-title">Email accounts shared with you</div>
            </div>
            <table className="hl-table">
              <thead>
                <tr>
                  <th className="w-10">Primary</th>
                  <th>Email address</th>
                  <th className="w-15">Owned by</th>
                  <th className="w-10">Default email template</th>
                  <th className="w-10">Subscribed</th>
                  <th className="w-10">Shared with</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {sharedAccounts.map(emailAccount => {
                  const hasFullAccess = this.hasFullAccess(emailAccount);

                  return (
                    <tr key={emailAccount.id}>
                      <td>{hasFullAccess && <input type="radio" />}</td>
                      <td>{emailAccount.emailAddress}</td>
                      <td>{emailAccount.owner.fullName}</td>
                      <td>
                        {emailAccount.defaultTemplate ? emailAccount.defaultTemplate.name : '-'}
                      </td>
                      <td>
                        {hasFullAccess && (
                          <label className="switch">
                            <input
                              type="checkbox"
                              onChange={() => this.toggleHidden(emailAccount)}
                            />
                            <div className="slider round" />
                          </label>
                        )}
                      </td>
                      <td>
                        {emailAccount.privacy !== EmailAccount.PUBLIC ? (
                          <button
                            className="hl-primary-btn"
                            onClick={() => this.openSharedWithModal(emailAccount)}
                          >
                            {emailAccount.sharedEmailConfigs.length}
                            <i className="lilicon hl-entity-icon m-l-5" />
                          </button>
                        ) : (
                          <span>All</span>
                        )}
                      </td>
                      <td />
                    </tr>
                  );
                })}

                {sharedAccounts.length === 0 && (
                  <tr>
                    <td colSpan="8">{t('preferences.sharedEmailAccounts')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedAccount && (
          <LilyModal modalOpen={this.state.modalOpen} closeModal={this.closeSharedWithModal}>
            {selectedAccount.owner.id === currentUser.id ? (
              <React.Fragment>
                <h3>Share your email</h3>
                <div className="shared-with-users">
                  <div className="m-b-15">
                    Give specific colleagues additional permissions to your email
                  </div>
                </div>

                <UserShare
                  handleAdditions={this.handleAdditions}
                  addAdditions={this.addAdditions}
                  emailAccount={selectedAccount}
                  // shareAdditions={shareAdditions}
                />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <h3>Account shared with</h3>

                <div className="shared-with-users">
                  <div className="m-b-15">
                    {selectedAccount.owner.fullName} has shared this account with
                  </div>

                  {selectedAccount.sharedEmailConfigs.map(config => {
                    const foundUser = users.find(user => user.id === config.user);

                    return (
                      <div className="user-row" key={config.id}>
                        <div className="user-info">
                          <img
                            className="user-avatar m-r-15"
                            src={foundUser.profilePicture}
                            alt="User avatar"
                          />
                          <div>{foundUser.fullName}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </React.Fragment>
            )}
          </LilyModal>
        )}
      </BlockUI>
    );
  }
}

export default withNamespaces('emptyStates')(withContext(EmailAccountList));
