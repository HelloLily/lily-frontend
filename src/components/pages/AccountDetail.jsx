import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import withContext from 'src/withContext';
import objectToHash from 'utils/objectToHash';
import LoadingIndicator from 'components/Utils/LoadingIndicator';
import AccountDetailWidget from 'components/ContentBlock/AccountDetailWidget';
import DealListWidget from 'components/ContentBlock/DealListWidget';
import CaseListWidget from 'components/ContentBlock/CaseListWidget';
import DetailActions from 'components/ContentBlock/DetailActions';
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

    await this.getAccount();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  getAccount = async () => {
    const { id } = this.props.match.params;
    const account = await Account.get(id);

    if (this.mounted) {
      this.setState({ account });
    }

    document.title = `${account.name} - Lily`;
  };

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
    const { currentUser } = this.props;

    const externalAppLink =
      currentUser.tenant.externalAppLinks.length > 0
        ? currentUser.tenant.externalAppLinks[0]
        : null;

    const extra =
      this.props.match.path.includes('accounts') && account ? (
        <React.Fragment>
          {account.customerId && externalAppLink ? (
            <a
              href={externalAppLink.url.replace(/\[\[.+\]\]/, account.customerId)}
              className="hl-primary-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={['far', 'external-link']} className="m-r-5" />
              {externalAppLink.name}
            </a>
          ) : null}

          <DetailActions item={account} openSidebar={this.openSidebar} />
        </React.Fragment>
      ) : null;

    return (
      <React.Fragment>
        {account ? (
          <div className="detail-page">
            <AccountDetailWidget
              account={account}
              extra={extra}
              submitCallback={this.updateAccount}
              key={objectToHash(account)}
            />

            <DealListWidget object={account} />

            <CaseListWidget object={account} />

            <ActivityStream object={account} />

            <ContactListWidget object={account} />
          </div>
        ) : (
          <LoadingIndicator />
        )}
      </React.Fragment>
    );
  }
}

export default withContext(AccountDetail);
