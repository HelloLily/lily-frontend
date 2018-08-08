import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import withContext from 'src/withContext';
import List from 'components/List';
import ListActions from 'components/List/ListActions';
import BlockUI from 'components/Utils/BlockUI';
import User from 'models/User';
import EmailAccount from 'models/EmailAccount';

class EmailAccountList extends Component {
  constructor(props) {
    super(props);

    this.state = { emailAccounts: [], sharedAccounts: [], loading: true };
  }

  async componentDidMount() {
    const { currentUser } = this.props;
    const ownedAccountsResponse = await EmailAccount.query({ owner: currentUser.id });
    const sharedAccountsResponse = await EmailAccount.query({
      sharedemailconfig__user__id: currentUser.id
    });
    const publicAccountsResponse = await EmailAccount.query({ privacy: EmailAccount.PUBLIC });

    const emailAccounts = ownedAccountsResponse.results;
    const sharedAccounts = [...sharedAccountsResponse.results, ...publicAccountsResponse.results];

    this.setState({
      emailAccounts,
      sharedAccounts,
      loading: false
    });
  }

  render() {
    const { emailAccounts, sharedAccounts, loading } = this.state;

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
                <th>Primary</th>
                <th>Email address</th>
                <th>Label</th>
                <th>Privacy setting</th>
                <th>Default email template</th>
                <th>Subscribed</th>
                <th>Shared with</th>
                <th>Actions</th>
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
                      <input type="checkbox" onChange={() => this.toggleHidden(emailAccount)} />
                      <div className="slider round" />
                    </label>
                  </td>
                  <td>-</td>
                  <td>
                    <ListActions object={emailAccount} {...this.props} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </List>

        <div className="m-t-25">
          <List>
            <div className="list-header">
              <div className="list-title">Email accounts shared with you</div>
            </div>
            <table className="hl-table">
              <thead>
                <tr>
                  <th>Primary</th>
                  <th>Email address</th>
                  <th>Owned by</th>
                  <th>Default email template</th>
                  <th>Subscribed</th>
                  <th>Shared with</th>
                </tr>
              </thead>
              <tbody>
                {sharedAccounts.map(emailAccount => (
                  <tr key={emailAccount.id}>
                    <td>
                      <input type="radio" />
                    </td>
                    <td>{emailAccount.emailAddress}</td>
                    <td>{emailAccount.owner.fullName}</td>
                    <td>
                      {emailAccount.defaultTemplate ? emailAccount.defaultTemplate.name : '-'}
                    </td>
                    <td>
                      <label className="switch">
                        <input type="checkbox" onChange={() => this.toggleHidden(emailAccount)} />
                        <div className="slider round" />
                      </label>
                    </td>
                    <td>-</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </List>
        </div>
      </BlockUI>
    );
  }
}

export default withContext(EmailAccountList);
