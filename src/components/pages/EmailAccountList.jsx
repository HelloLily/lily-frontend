import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withTranslation, Trans } from 'react-i18next';

import withContext from 'src/withContext';
import { errorToast, successToast } from 'utils/toasts';
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

    this.mounted = false;

    this.state = {
      emailAccounts: [],
      sharedAccounts: [],
      modalOpen: false,
      selectedAccount: null,
      users: [],
      loading: true
    };

    document.title = 'Email accounts';
  }

  async componentDidMount() {
    this.mounted = true;

    await this.loadItems();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  loadItems = async () => {
    const { currentUser } = this.props;

    const ownedAccountsResponse = await EmailAccount.query({ owner: currentUser.id });
    const sharedAccountsResponse = await EmailAccount.query({
      sharedemailconfig__user__id: currentUser.id
    });
    const publicAccountsResponse = await EmailAccount.query({ privacy: EmailAccount.PUBLIC });
    const emailAccounts = ownedAccountsResponse.results.map(emailAccount => {
      const emailConfig = emailAccount.sharedEmailConfigs.find(
        config => config.user === currentUser.id
      );

      if (emailConfig) {
        emailAccount.isHidden = emailConfig.isHidden;
      }

      emailAccount.sharedEmailConfigs = emailAccount.sharedEmailConfigs.filter(
        // Filter out the user's own configuration.
        config => config.user !== currentUser.id
      );

      return emailAccount;
    });
    // Merge the two arrays and filter out any email accounts belonging to the current user.
    const sharedAccounts = [
      ...sharedAccountsResponse.results,
      ...publicAccountsResponse.results
    ].filter(emailAccount => emailAccount.owner.id !== currentUser.id);

    if (this.mounted) {
      this.setState({
        emailAccounts,
        sharedAccounts,
        selectedAccount: null,
        loading: false
      });
    }
  };

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

  toggleHidden = async emailAccount => {
    const { emailAccounts, sharedAccounts } = this.state;
    const { currentUser, t } = this.props;

    const args = {
      emailAccount: emailAccount.id,
      isHidden: !emailAccount.isHidden,
      user: currentUser.id
    };

    try {
      await SharedEmailConfig.post(args);

      let index = emailAccounts.findIndex(account => account.id === emailAccount.id);

      if (index > -1) {
        emailAccounts[index].isHidden = args.isHidden;
      } else {
        index = sharedAccounts.findIndex(account => account.id === emailAccount.id);

        if (index > -1) {
          sharedAccounts[index].isHidden = args.isHidden;
        }
      }

      this.setState({ emailAccounts, sharedAccounts });

      successToast(t('toasts:modelUpdated', { model: 'email account' }));
    } catch (error) {
      errorToast(t('toasts:error'));
    }
  };

  setPrimaryAccount = async emailAccount => {
    const { currentUser, setCurrentUser, t } = this.props;

    const args = {
      id: 'me',
      primaryEmailAccount: { id: emailAccount.id }
    };

    try {
      await User.patch(args);

      currentUser.primaryEmailAccount = emailAccount;
      setCurrentUser(currentUser);

      successToast(t('toasts:primaryAccountUpdated', { label: emailAccount.label }));
    } catch (error) {
      errorToast(t('toasts:error'));
    }
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

  updateEmailAccount = () => {
    const { emailAccounts, selectedAccount } = this.state;
    const index = emailAccounts.findIndex(item => item.id === selectedAccount.id);

    emailAccounts[index] = selectedAccount;

    this.setState({ emailAccounts });
  };

  updateModel = async () => {
    const { selectedAccount } = this.state;
    const { t } = this.props;

    const sharedEmailConfigs = selectedAccount.sharedEmailConfigs.map(config => {
      config.user = config.user.id || config.user;

      return config;
    });

    const args = {
      id: selectedAccount.id,
      sharedEmailConfigs
    };

    try {
      await EmailAccount.patch(args);
      await this.loadItems();

      successToast(t('toasts:modelUpdated', { model: 'email account' }));
    } catch (error) {
      errorToast(t('toasts:error'));
    }
  };

  removeItem = ({ id }) => {
    const { emailAccounts } = this.state;

    const index = emailAccounts.findIndex(item => item.id === id);
    emailAccounts.splice(index, 1);

    this.setState({ emailAccounts });
  };

  render() {
    const { emailAccounts, sharedAccounts, selectedAccount, users, loading } = this.state;
    const { currentUser, t } = this.props;

    const primaryEmailAccount = currentUser.primaryEmailAccount
      ? currentUser.primaryEmailAccount.id
      : null;

    const accountTotal = emailAccounts.length + sharedAccounts.length;

    return (
      <BlockUI blocking={loading}>
        <div className="list">
          <div className="list-header">
            <div className="list-title flex-grow">Your email accounts</div>

            <button className="hl-primary-btn" onClick={this.setupEmailAccount}>
              <FontAwesomeIcon icon={['far', 'plus']} /> Email account
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
              {emailAccounts.map(emailAccount => (
                <tr key={emailAccount.id}>
                  <td>
                    <input
                      type="radio"
                      checked={primaryEmailAccount === emailAccount.id}
                      onChange={() => this.setPrimaryAccount(emailAccount)}
                    />
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
                        <FontAwesomeIcon icon={['far', 'user']} className="m-l-5" />
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

              {emailAccounts.length === 0 && (
                <tr>
                  <td colSpan="8">{t('emptyStates:preferences.emailAccounts')}</td>
                </tr>
              )}

              {currentUser.isFreePlan && accountTotal >= 2 && (
                <tr>
                  <td colSpan="8">
                    {currentUser.isAdmin ? (
                      <Trans
                        defaults={t('tooltips:emailLimitReachedIsAdmin')}
                        components={[<Link to="/preferences/billing">text</Link>]}
                      />
                    ) : (
                      <React.Fragment>
                        {t('tooltips:emailLimitReached', { name: currentUser.tenant.admin })}
                      </React.Fragment>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="m-t-25">
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
                    <tr
                      key={emailAccount.id}
                      className={currentUser.isFreePlan ? ' is-disabled' : ''}
                    >
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
                            <FontAwesomeIcon icon={['far', 'user']} className="m-l-5" />
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
                    <td colSpan="8">{t('emptyStates:preferences.sharedEmailAccounts')}</td>
                  </tr>
                )}
                {currentUser.isFreePlan && sharedAccounts.length > 0 && (
                  <tr>
                    <td colSpan="8">
                      {currentUser.isAdmin ? (
                        <Trans
                          defaults={t('tooltips:sharingUnavailableIsAdmin')}
                          components={[<Link to="/preferences/billing">text</Link>]}
                        />
                      ) : (
                        <React.Fragment>
                          {t('tooltips:sharingUnavailable', { name: currentUser.tenant.admin })}
                        </React.Fragment>
                      )}
                    </td>
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
                  <div className="m-b-15">{t('forms:emailAccount.advancedInfo')}</div>
                </div>

                <UserShare
                  updateEmailAccount={this.updateEmailAccount}
                  emailAccount={selectedAccount}
                />

                <div className="m-t-15">
                  <button className="hl-primary-btn-blue" onClick={this.updateModel}>
                    Save
                  </button>

                  <button className="hl-primary-btn m-l-10" onClick={this.closeModal}>
                    Cancel
                  </button>
                </div>
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
                          <img className="user-avatar m-r-15" src={foundUser.profilePicture} />
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

export default withTranslation(['emptyStates', 'toasts', 'forms', 'tooltips'])(
  withContext(EmailAccountList)
);
