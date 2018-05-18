import React, { Component } from 'react';

import AccountDetailWidget from 'components/Widget/AccountDetailWidget';
import DealListWidget from 'components/Widget/DealListWidget';
import CaseListWidget from 'components/Widget/CaseListWidget';
import ContactListWidget from 'components/Widget/ContactListWidget';
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
            <AccountDetailWidget account={account} submitCallback={this.submitCallback} />

            <DealListWidget object={account} submitCallback={this.submitCallback} />

            <CaseListWidget object={account} submitCallback={this.submitCallback} />

            <ActivityStream object={account} />

            <ContactListWidget object={account} />
          </div>
        ) : (
          <div>Loading</div>
        )}
      </React.Fragment>
    );
  }
}

export default AccountDetail;
