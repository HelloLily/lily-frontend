import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import updateModel from 'utils/updateModel';
import AccountDetailWidget from 'components/ContentBlock/AccountDetailWidget';
import DealListWidget from 'components/ContentBlock/DealListWidget';
import CaseListWidget from 'components/ContentBlock/CaseListWidget';
import ContactListWidget from 'components/ContentBlock/ContactListWidget';
import ActivityStream from 'components/ActivityStream';
import Account from 'models/Account';

class AccountDetail extends Component {
  constructor(props) {
    super(props);

    this.state = { account: null };
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    const account = await Account.get(id);

    this.setState({ account });

    document.title = `${account.name} - Lily`;
  }

  submitCallback = async args => {
    await updateModel(this.state.account, args);
  };

  render() {
    const { account } = this.state;
    const { id } = this.props.match.params;

    return (
      <React.Fragment>
        {account ? (
          <React.Fragment>
            <div className="detail-page-header">
              <Link to={`/accounts/${id}/edit`} className="hl-interface-btn">
                <i className="lilicon hl-edit-icon" />
              </Link>

              <button className="hl-interface-btn">
                <i className="lilicon hl-trashcan-icon" />
              </button>
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
          <div>Loading</div>
        )}
      </React.Fragment>
    );
  }
}

export default AccountDetail;
