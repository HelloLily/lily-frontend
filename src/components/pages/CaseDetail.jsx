import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import Editable from 'components/Editable';
import Widget from 'components/Widget';
import LilyDate from 'components/Utils/LilyDate';
import AccountDetailWidget from 'components/Widget/AccountDetailWidget';
import ActivityStream from 'components/ActivityStream';
import Account from 'models/Account';
import Contact from 'models/Contact';
import Case from 'models/Case';

class CaseDetail extends Component {
  constructor(props) {
    super(props);

    this.state = { caseObj: null, caseStatuses: [] };
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    const caseObj = await Case.get(id);
    const statusRequest = await Case.getStatuses();

    if (caseObj.account) {
      caseObj.account = await Account.get(caseObj.account.id);
    }

    if (caseObj.contact) {
      caseObj.contact = await Contact.get(caseObj.contact.id);
    }

    this.setState({ caseObj, caseStatuses: statusRequest.results });
  }

  toggleArchive = () => {
    const { caseObj } = this.state;
    const isArchived = !caseObj.isArchived;

    const args = {
      id: caseObj.id,
      isArchived
    };

    this.submitCallback(args).then(() => {
      caseObj.isArchived = isArchived;

      this.setState({ caseObj });
    });
  };

  changeStatus = status => {
    const { caseObj } = this.state;

    const args = {
      id: caseObj.id,
      status: status.id
    };

    this.submitCallback(args).then(() => {
      caseObj.status = status;

      this.setState({ caseObj });
    });
  };

  updateModel = (data, field) => {
    const { caseObj } = this.state;

    const args = {};
  };

  submitCallback = args => Case.patch(args);

  render() {
    const { caseObj, caseStatuses } = this.state;

    const title = (
      <React.Fragment>
        <div className="widget-label cases" />
        <div className="widget-name">
          <i className="lilicon hl-case-icon m-r-5" />
          Case details
        </div>
      </React.Fragment>
    );

    return (
      <React.Fragment>
        {caseObj ? (
          <div className="detail-page">
            <div>
              <AccountDetailWidget account={caseObj.account} submitCallback={this.submitCallback} />

              <Widget title={title} component="caseDetailWidget" className="m-t-25">
                <div className="detail-row">
                  <div>
                    <i className="lilicon hl-status-icon" /> Priority
                  </div>
                  <div>
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
                  <div>
                    <i className="lilicon hl-status-icon" /> Type
                  </div>
                  <div>
                    <Editable
                      type="select"
                      field="type"
                      object={caseObj}
                      submitCallback={this.submitCallback}
                    />
                  </div>
                </div>

                <div className="detail-row">
                  <div>
                    <i className="lilicon hl-entity-icon" /> Expires on
                  </div>
                  <div>
                    <LilyDate date={caseObj.expires} />
                  </div>
                </div>

                <div className="detail-row">
                  <div>
                    <i className="lilicon hl-entity-icon" /> Created by
                  </div>
                  <div>
                    {caseObj.createdBy ? caseObj.createdBy.fullName : 'Unknown'}

                    <span>
                      {' '}
                      on <LilyDate date={caseObj.created} />
                    </span>
                  </div>
                </div>

                <div className="detail-row">
                  <div>
                    <i className="lilicon hl-entity-icon" /> Assigned to
                  </div>
                  <div>
                    <Editable
                      async
                      type="select"
                      field="assignedTo"
                      object={caseObj}
                      submitCallback={this.submitCallback}
                    />
                  </div>
                </div>

                <div className="detail-row">
                  <div>
                    <i className="lilicon hl-entities-icon" /> Assigned to teams
                  </div>
                  <div>
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
                  <div>
                    <FontAwesomeIcon icon="tags" /> Tags
                  </div>
                  <div>
                    <Editable
                      multi
                      type="tags"
                      field="tags"
                      object={caseObj}
                      submitCallback={this.submitCallback}
                    />
                  </div>
                </div>
              </Widget>
            </div>

            <div className="grid-column-2">
              <div className="widget-container m-b-25">
                <div className="widget">
                  <div className="widget-header space-between">
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
                      <FontAwesomeIcon icon="archive" />{' '}
                      {caseObj.isArchived ? 'Unarchive' : 'Archive'}
                    </button>
                  </div>

                  <div className="widget-content">
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
                        <LilyDate date={caseObj.created} format="D MMM. YYYY HH:MM" />
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

              <ActivityStream object={caseObj} />
            </div>
          </div>
        ) : (
          <div>Loading</div>
        )}
      </React.Fragment>
    );
  }
}

export default CaseDetail;
