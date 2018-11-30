import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import updateModel from 'utils/updateModel';
import LoadingIndicator from 'components/Utils/LoadingIndicator';
import AccountDetailWidget from 'components/ContentBlock/AccountDetailWidget';
import DealListWidget from 'components/ContentBlock/DealListWidget';
import CaseListWidget from 'components/ContentBlock/CaseListWidget';
import ContactListWidget from 'components/ContentBlock/ContactListWidget';
import ActivityStream from 'components/ActivityStream';
import Account from 'models/Account';

class AccountDetail extends Component {
  constructor(props) {
    super(props);

    this.mounted = false;

    this.state = { account: null };
  }

  async componentDidMount() {
    this.mounted = true;

    const { id } = this.props.match.params;
    const account = await Account.get(id);

    if (this.mounted) {
      this.setState({ account });
    }

    document.title = `${account.name} - Lily`;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  submitCallback = async args => {
    const { account } = this.state;

    await updateModel(account, args);

    if (args.hasOwnProperty('socialMedia')) {
      const profile = args.socialMedia[0];
      const index = account.socialMedia.findIndex(item => item.name === profile.name);

      if (index > -1) {
        if (!profile.isDeleted) {
          account.socialMedia[index].username = profile.username;
        } else {
          // Profile was deleted, so just remove it.
          account.socialMedia.splice(index, 1);
        }
      } else {
        // New profile added.
        account.socialMedia.push(profile);
      }
    }

    // Force the editable components to update.
    this.forceUpdate();
  };

  render() {
    const { account } = this.state;
    const { id } = this.props.match.params;

    return (
      <React.Fragment>
        {account ? (
          <React.Fragment>
            <div className="detail-page-header">
              <div>
                <Link to={`/accounts/${id}/edit`} className="hl-interface-btn">
                  <i className="lilicon hl-edit-icon" />
                </Link>

                <button className="hl-interface-btn">
                  <i className="lilicon hl-trashcan-icon" />
                </button>
              </div>
            </div>

            <div className="detail-page">
              <AccountDetailWidget account={account} submitCallback={this.submitCallback} />

              <DealListWidget object={account} submitCallback={this.submitCallback} />

              <CaseListWidget object={account} submitCallback={this.submitCallback} />

              <ActivityStream object={account} />

              <ContactListWidget object={account} />
            </div>
          </React.Fragment>
        ) : (
          <LoadingIndicator />
        )}
      </React.Fragment>
    );
  }
}

export default AccountDetail;
