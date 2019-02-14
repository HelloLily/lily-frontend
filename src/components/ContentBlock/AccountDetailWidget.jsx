import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import withContext from 'src/withContext';
import { ACCOUNT_ACTIVE_STATUS } from 'lib/constants';
import updateModel from 'utils/updateModel';
import ContentBlock from 'components/ContentBlock';
import Editable from 'components/Editable';
import Account from 'models/Account';

class AccountDetailWidget extends Component {
  submitCallback = async args => {
    const { account } = this.props;

    if (args.customerId) {
      const statusResponse = await Account.statuses();
      const activeStatus = statusResponse.results.find(
        status => status.name === ACCOUNT_ACTIVE_STATUS
      );

      args.status = activeStatus.id;
      account.status = activeStatus;
    }

    const response = await updateModel(account, args);

    Object.keys(args).forEach(key => {
      account[key] = response[key];
    });

    this.forceUpdate();
  };

  assignToMe = async () => {
    const { account, currentUser } = this.props;
    const args = {
      id: account.id,
      assignedTo: currentUser.id
    };

    await this.submitCallback(args);
  };

  openSidebar = () => {
    const data = {
      id: this.props.account.id,
      submitCallback: this.props.submitCallback
    };

    this.props.setSidebar('account', data);
  };

  render() {
    const { account, clickable, currentUser, extra } = this.props;

    const title = (
      <React.Fragment>
        <div className="content-block-label" />
        <div className="content-block-name">
          <FontAwesomeIcon icon={['far', 'building']} className="m-r-5" />

          {clickable && !account.isDeleted && (
            <Link to={`/accounts/${account.id}`}>{account.name}</Link>
          )}

          {(!clickable || account.isDeleted) && <React.Fragment>{account.name}</React.Fragment>}
        </div>
      </React.Fragment>
    );

    const assignedKey = account.assignedTo ? account.assignedTo.id : null;

    return (
      <ContentBlock title={title} extra={extra} component="accountDetailWidget">
        <div className="detail-row">
          <div>
            <FontAwesomeIcon icon={['far', 'user-tie']} /> Status
          </div>
          <div>
            <Editable
              key={account.status.id}
              type="select"
              object={account}
              field="status"
              submitCallback={this.submitCallback}
            />
          </div>
        </div>

        <div className="detail-row">
          <div>
            <FontAwesomeIcon icon={['far', 'envelope']} /> Email
          </div>
          <div>
            <Editable
              type="related"
              field="emailAddresses"
              object={account}
              submitCallback={this.submitCallback}
            />
          </div>
        </div>

        <div className="detail-row">
          <div>
            <FontAwesomeIcon icon={['far', 'phone']} flip="horizontal" /> Phone
          </div>
          <div>
            <Editable
              type="related"
              field="phoneNumbers"
              object={account}
              submitCallback={this.submitCallback}
            />
          </div>
        </div>

        <div className="detail-row">
          <div>
            <FontAwesomeIcon icon={['far', 'globe']} /> Website
          </div>
          <div>
            <Editable
              type="related"
              field="websites"
              object={account}
              submitCallback={this.submitCallback}
            />
          </div>
        </div>

        <div className="detail-row">
          <div>
            <FontAwesomeIcon icon={['far', 'user-circle']} /> Assigned to
          </div>
          <div>
            <Editable
              key={JSON.stringify(assignedKey)}
              type="select"
              field="assignedTo"
              object={account}
              submitCallback={this.submitCallback}
            />

            {(!account.assignedTo || account.assignedTo.id !== currentUser.id) && (
              <button type="button" className="hl-interface-btn" onClick={this.assignToMe}>
                Assign to me
              </button>
            )}
          </div>
        </div>

        <div className="detail-row">
          <div>
            <FontAwesomeIcon icon={['far', 'map-marker-alt']} /> Address
          </div>
          <div>
            <Editable
              type="related"
              field="addresses"
              object={account}
              submitCallback={this.submitCallback}
            />
          </div>
        </div>

        <div className="detail-row">
          <div>
            <FontAwesomeIcon icon={['far', 'comment']} /> Social
          </div>
          <div>
            <Editable
              type="related"
              field="socialMedia"
              object={account}
              submitCallback={this.submitCallback}
            />
          </div>
        </div>

        <div className="detail-row">
          <div>
            <FontAwesomeIcon icon={['far', 'user']} /> Customer ID
          </div>
          <div>
            <Editable
              type="text"
              field="customerId"
              object={account}
              submitCallback={this.submitCallback}
            />
          </div>
        </div>

        <div className="detail-row">
          <div>
            <FontAwesomeIcon icon={['far', 'tags']} /> Tags
          </div>
          <div>
            <Editable
              multi
              type="tags"
              field="tags"
              object={account}
              submitCallback={this.submitCallback}
            />
          </div>
        </div>

        <div className="detail-description">
          <div>
            <strong>Description</strong>
          </div>
          <Editable
            type="textarea"
            field="description"
            object={account}
            submitCallback={this.submitCallback}
          />
        </div>
      </ContentBlock>
    );
  }
}

export default withContext(AccountDetailWidget);
