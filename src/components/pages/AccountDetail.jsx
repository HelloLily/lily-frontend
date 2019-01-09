import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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

  updateAccount = async account => {
    this.setState({ account });
  }

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
              <AccountDetailWidget account={account} />

              <DealListWidget object={account} />

              <CaseListWidget object={account} />

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
