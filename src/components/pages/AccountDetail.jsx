import React, { Component } from 'react';

import AccountDetailContentBlock from 'components/ContentBlock/AccountDetailWidget';
import DealListContentBlock from 'components/ContentBlock/DealListWidget';
import CaseListContentBlock from 'components/ContentBlock/CaseListWidget';
import ContactListContentBlock from 'components/ContentBlock/ContactListWidget';
import ActivityStream from 'components/ActivityStream';
import Account from 'models/Account';

class AccountDetail extends Component {
  constructor(props) {
    super(props);

    this.state = { account: null };
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    const data = await Account.get(id);

    this.setState({ account: data });
  }

  submitCallback = args => Account.patch(args);

  render() {
    const { account } = this.state;

    return (
      <React.Fragment>
        {account ? (
          <div className="detail-page">
            <AccountDetailContentBlock account={account} submitCallback={this.submitCallback} />

            <DealListContentBlock object={account} submitCallback={this.submitCallback} />

            <CaseListContentBlock object={account} submitCallback={this.submitCallback} />

            <ActivityStream object={account} />

            <ContactListContentBlock object={account} />
          </div>
        ) : (
          <div>Loading</div>
        )}
      </React.Fragment>
    );
  }
}

export default AccountDetail;
