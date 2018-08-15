import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-modal';

import withContext from 'src/withContext';
import List from 'components/List';
import ListActions from 'components/List/ListActions';
import BlockUI from 'components/Utils/BlockUI';
import UserShare from 'components/UserShare';
import SharedEmailConfig from 'models/SharedEmailConfig';
import EmailAccount from 'models/EmailAccount';

class EmailAccountList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emailAccounts: [],
      sharedAccounts: [],
      loading: true,
      modalOpen: false,
      selectedAccount: null
    };
  }

  async componentDidMount() {
    const { currentUser } = this.props;

    const ownedAccountsResponse = await EmailAccount.query({ owner: currentUser.id });
    const sharedAccountsResponse = await EmailAccount.query({
      sharedemailconfig__user__id: currentUser.id
    });
    const publicAccountsResponse = await EmailAccount.query({ privacy: EmailAccount.PUBLIC });

    const emailAccounts = ownedAccountsResponse.results.map(emailAccount => {
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
      emailAccounts,
      sharedAccounts,
      loading: false
    });
  }

  openSharedWithModal = async emailAccount => {
    this.setState({ modalOpen: true, selectedAccount: emailAccount });
  };

  closeSharedWithModal = () => {
    this.setState({ modalOpen: false, selectedAccount: null });
  };

  toggleHidden = emailAccount => {
    const args = {
      emailAccount: emailAccount.id,
      user: this.props.currentUser.id,
      isHidden: emailAccount.isHidden
    };

    SharedEmailConfig.post(args);
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

  render() {
    const { emailAccounts, sharedAccounts, loading, selectedAccount } = this.state;
    const { currentUser } = this.props;

    return (
      <BlockUI blocking={loading}>
        <List>
          <div className="list-header">
            <div className="list-title flex-grow">Your email accounts</div>

            <button className="hl-primary-btn">
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
              {emailAccounts.map(emailAccount => (
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
                    <ListActions object={emailAccount} {...this.props} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </List>

        <div className={`m-t-25${currentUser.tenant.isFreePlan ? ' is-disabled' : ''}`}>
          <List>
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
              </tbody>
            </table>
          </List>
        </div>

        {selectedAccount && (
          <Modal
            isOpen={this.state.modalOpen}
            onRequestClose={this.closeModal}
            className="lily-modal"
            overlayClassName="modal-overlay"
            parentSelector={() => document.querySelector('#app')}
            ariaHideApp={false}
          >
            <button onClick={this.closeSharedWithModal} className="close-btn float-right">
              <i className="lilicon hl-close-icon" />
            </button>

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

                  {selectedAccount.sharedEmailConfigs.map(config => (
                    <div className="user-row" key={config.id}>
                      <div className="user-info">
                        <img
                          className="user-avatar m-r-15"
                          src={config.user.profilePicture}
                          alt="User avatar"
                        />
                        <div>{config.user.fullName}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </React.Fragment>
            )}
          </Modal>
        )}
      </BlockUI>
    );
  }
}

export default withContext(EmailAccountList);
