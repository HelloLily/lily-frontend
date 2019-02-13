import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import withContext from 'src/withContext';
import LoadingIndicator from 'components/Utils/LoadingIndicator';
import DeleteConfirmation from 'components/Utils/DeleteConfirmation';
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
  };

  openSidebar = () => {
    const data = {
      id: this.state.account.id,
      submitCallback: this.updateAccount
    };

    this.props.setSidebar('account', data);
  };

  render() {
    const { account } = this.state;

    return (
      <React.Fragment>
        {account ? (
          <React.Fragment>
            <div className="detail-page-header">
              <div>
                <button className="hl-primary-btn borderless" onClick={this.openSidebar}>
                  <FontAwesomeIcon icon={['far', 'pencil-alt']} />
                </button>

                <DeleteConfirmation item={account} />
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

export default withContext(AccountDetail);
