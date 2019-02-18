import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import withContext from 'src/withContext';
import objectToHash from 'utils/objectToHash';
import updateModel from 'utils/updateModel';
import Editable from 'components/Editable';
import ContentBlock from 'components/ContentBlock';
import LilyDate from 'components/Utils/LilyDate';
import Postpone from 'components/Postpone';
import LoadingIndicator from 'components/Utils/LoadingIndicator';
import AccountDetailWidget from 'components/ContentBlock/AccountDetailWidget';
import TimeLoggingWidget from 'components/ContentBlock/TimeLoggingWidget';
import DetailActions from 'components/ContentBlock/DetailActions';
import ActivityStream from 'components/ActivityStream';
import EmailEditor from 'components/EmailEditor';
import BlockUI from 'components/Utils/BlockUI';
import TimeLog from 'models/TimeLog';
import Account from 'models/Account';
import Contact from 'models/Contact';
import Case from 'models/Case';

class CaseDetail extends Component {
  constructor(props) {
    super(props);

    this.mounted = false;
    this.recipients = [];

    this.state = {
      caseObj: null,
      caseStatuses: [],
      showEditor: false,
      loading: true
    };
  }

  async componentDidMount() {
    this.mounted = true;

    await this.getCase();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  getCase = async () => {
    const { id } = this.props.match.params;

    this.setState({ loading: true });

    const caseObj = await Case.get(id);
    const statusResponse = await Case.statuses();
    const timeLogResponse = await TimeLog.getForObject(caseObj);

    if (caseObj.account) {
      caseObj.account = await Account.get(caseObj.account.id, { filterDeleted: false });
    }

    if (caseObj.contact) {
      caseObj.contact = await Contact.get(caseObj.contact.id, { filterDeleted: false });

      if (caseObj.contact.emailAddresses.length > 0) {
        this.recipients = this.getRecipients(caseObj);
      }
    }

    caseObj.timeLogs = timeLogResponse.results;

    if (this.mounted) {
      this.setState({
        caseObj,
        caseStatuses: statusResponse.results,
        loading: false
      });
    }

    document.title = `${caseObj.subject} - Lily`;
  };

  getRecipients = ({ account, contact }) => {
    let emailAddress = null;

    if (account && contact) {
      if (contact.emailAddresses.length === 0) {
        // No personal email addresses, but account has email addresses.
        if (account.emailAddresses.length > 1) {
          // Get the email address set as primary or otherwise just the first one.
          emailAddress =
            account.emailAddresses.find(email => email.isPrimary) || account.emailAddresses[0];
        }
      } else {
        // Check if any of the contact's email addresses match any of the account's domains.
        account.websites.forEach(website => {
          emailAddress = contact.emailAddresses.find(email =>
            email.emailAddress.includes(website.secondLevel)
          );
        });
      }
    }

    if (!emailAddress) {
      // Try to find an email address which has been set as 'Primary'.
      // Otherwise just get the first email address.
      if (contact) {
        emailAddress =
          contact.emailAddresses.find(email => email.isPrimary) || contact.emailAddresses[0];
      } else if (account) {
        emailAddress =
          account.emailAddresses.find(email => email.isPrimary) || account.emailAddresses[0];
      }
    }

    if (emailAddress) {
      return [{ ...contact, emailAddress: emailAddress.emailAddress }];
    }

    return [];
  };

  toggleArchive = async () => {
    const { caseObj } = this.state;
    const isArchived = !caseObj.isArchived;

    const args = {
      id: caseObj.id,
      isArchived
    };

    await this.submitCallback(args);

    caseObj.isArchived = isArchived;

    this.setState({ caseObj });
  };

  changeStatus = async status => {
    const { caseObj } = this.state;

    const args = {
      id: caseObj.id,
      status: status.id
    };

    await this.submitCallback(args);

    caseObj.status = status;

    this.setState({ caseObj });
  };

  assignToMe = async () => {
    const { caseObj } = this.state;
    const { currentUser } = this.props;

    const args = {
      id: caseObj.id,
      assignedTo: currentUser.id
    };

    await this.submitCallback(args);
  };

  submitCallback = async args => {
    const { caseObj } = this.state;
    this.setState({ loading: true });

    const response = await updateModel(caseObj, args);

    Object.keys(args).forEach(key => {
      caseObj[key] = response[key];
    });

    this.setState({ caseObj, loading: false });
  };

  openEditor = () => {
    this.setState({ showEditor: true });
  };

  closeEditor = () => {
    this.setState({ showEditor: false });
  };

  openSidebar = () => {
    const data = {
      id: this.state.caseObj.id,
      submitCallback: this.getCase
    };

    this.props.setSidebar('case', data);
  };

  render() {
    const { caseObj, caseStatuses, showEditor, loading } = this.state;
    const { currentUser } = this.props;

    const assignedKey = caseObj && caseObj.assignedTo ? caseObj.assignedTo.id : null;

    const title = (
      <React.Fragment>
        <div className="content-block-label cases" />
        <div className="content-block-name">
          <FontAwesomeIcon icon={['far', 'briefcase']} className="m-r-5" />
          <Editable
            type="text"
            object={caseObj}
            field="subject"
            submitCallback={this.submitCallback}
          />
        </div>
      </React.Fragment>
    );

    const extra = <DetailActions item={caseObj} openSidebar={this.openSidebar} />;

    return (
      <React.Fragment>
        {caseObj ? (
          <React.Fragment>
            <div className="detail-page">
              <div>
                <BlockUI blocking={loading}>
                  <ContentBlock
                    title={title}
                    extra={extra}
                    component="caseDetailWidget"
                    className="m-b-25"
                    fullHeight
                    key={objectToHash(caseObj)}
                  >
                    <div className="detail-row">
                      <div>Priority</div>
                      <div className="has-editable">
                        <Editable
                          icon
                          type="select"
                          field="priority"
                          object={caseObj}
                          submitCallback={this.submitCallback}
                        />
                      </div>
                    </div>

                    <div className="detail-row">
                      <div>Type</div>
                      <div className="has-editable">
                        <Editable
                          type="select"
                          field="type"
                          object={caseObj}
                          submitCallback={this.submitCallback}
                        />
                      </div>
                    </div>

                    <div className="detail-row">
                      <div>Expires on</div>
                      <div>
                        <Postpone object={caseObj} field="expires" />
                      </div>
                    </div>

                    <div className="detail-row">
                      <div>Created by</div>
                      <div>
                        {caseObj.createdBy ? caseObj.createdBy.fullName : 'Unknown'}

                        <span>
                          {' on '} <LilyDate date={caseObj.created} />
                        </span>
                      </div>
                    </div>

                    <div className="detail-row">
                      <div>Assigned to</div>
                      <div className="has-editable">
                        <Editable
                          async
                          key={JSON.stringify(assignedKey)}
                          type="select"
                          field="assignedTo"
                          object={caseObj}
                          submitCallback={this.submitCallback}
                        />

                        {(!caseObj.assignedTo || caseObj.assignedTo.id !== currentUser.id) && (
                          <button
                            type="button"
                            className="hl-interface-btn"
                            onClick={this.assignToMe}
                          >
                            Assign to me
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="detail-row">
                      <div>Assigned to teams</div>
                      <div className="has-editable">
                        <Editable
                          multi
                          type="select"
                          field="assignedToTeams"
                          object={caseObj}
                          submitCallback={this.submitCallback}
                        />
                      </div>
                    </div>

                    <div className="detail-row">
                      <div>Tags</div>
                      <div className="has-editable">
                        <Editable
                          multi
                          type="tags"
                          field="tags"
                          object={caseObj}
                          submitCallback={this.submitCallback}
                        />
                      </div>
                    </div>
                  </ContentBlock>
                </BlockUI>

                {caseObj.account && (
                  <React.Fragment>
                    <AccountDetailWidget
                      clickable
                      account={caseObj.account}
                      updateAccount={this.updateAccount}
                    />

                    <div className="m-b-25" />
                  </React.Fragment>
                )}

                <TimeLoggingWidget object={caseObj} />
              </div>

              <div className="grid-column-2">
                <BlockUI blocking={loading}>
                  <div className="content-block-container m-b-25" key={objectToHash(caseObj)}>
                    <div className="content-block">
                      <div className="content-block-header space-between">
                        <div className={`hl-btn-group${caseObj.isArchived ? ' is-disabled' : ''}`}>
                          {caseStatuses.map(status => (
                            <button
                              key={status.id}
                              className={`hl-primary-btn${
                                status.id === caseObj.status.id ? ' selected' : ''
                              }`}
                              onClick={() => this.changeStatus(status)}
                            >
                              {status.name}
                            </button>
                          ))}
                        </div>

                        <button className="hl-primary-btn" onClick={this.toggleArchive}>
                          <FontAwesomeIcon icon={['far', 'archive']} />{' '}
                          {caseObj.isArchived ? 'Unarchive' : 'Archive'}
                        </button>
                      </div>

                      <div className="content-block-content">
                        <div className="display-flex space-between">
                          <strong>
                            <Editable
                              type="text"
                              object={caseObj}
                              field="subject"
                              submitCallback={this.submitCallback}
                            />
                          </strong>

                          <div className="text-muted">
                            <LilyDate date={caseObj.created} format="d MMM. yyyy HH:MM" />
                          </div>
                        </div>

                        <Editable
                          type="textarea"
                          object={caseObj}
                          field="description"
                          submitCallback={this.submitCallback}
                        />
                      </div>
                    </div>
                  </div>
                </BlockUI>

                <ActivityStream object={caseObj} />

                {showEditor && (
                  <EmailEditor fixed setSending={this.setSending} recipients={this.recipients} />
                )}

                {caseObj.account && (
                  <React.Fragment>
                    <div className="m-b-25" />

                    <ActivityStream object={caseObj.account} parentObject={caseObj} />
                  </React.Fragment>
                )}
              </div>
            </div>
          </React.Fragment>
        ) : (
          <LoadingIndicator />
        )}
      </React.Fragment>
    );
  }
}

export default withContext(CaseDetail);
