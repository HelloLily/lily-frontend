import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import Editable from 'components/Editable';
import ContentBlock from 'components/ContentBlock';
import LilyDate from 'components/Utils/LilyDate';
import AccountDetailWidget from 'components/ContentBlock/AccountDetailWidget';
import ActivityStream from 'components/ActivityStream';
import BlockUI from 'components/Utils/BlockUI';
import Account from 'models/Account';
import Contact from 'models/Contact';
import Case from 'models/Case';
import updateModel from 'src/utils/updateModel';

class CaseDetail extends Component {
  constructor(props) {
    super(props);

    this.state = { caseObj: null, caseStatuses: [], loading: true };
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    const caseObj = await Case.get(id);
    const statusRequest = await Case.statuses();

    if (caseObj.account) {
      caseObj.account = await Account.get(caseObj.account.id);
    }

    if (caseObj.contact) {
      caseObj.contact = await Contact.get(caseObj.contact.id);
    }

    this.setState({ caseObj, caseStatuses: statusRequest.results, loading: false });

    document.title = `${caseObj.subject} - Lily`;
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

  submitCallback = async args => {
    this.setState({ loading: true });

    await updateModel(this.state.caseObj, args);

    this.setState({ loading: false });
  };

  render() {
    const { caseObj, caseStatuses, loading } = this.state;
    const { id } = this.props.match.params;

    const title = (
      <React.Fragment>
        <div className="content-block-label cases" />
        <div className="content-block-name">
          <i className="lilicon hl-case-icon m-r-5" />
          Case details
        </div>
      </React.Fragment>
    );

    return (
      <React.Fragment>
        {caseObj ? (
          <React.Fragment>
            <div className="detail-page-header">
              <div>
                <Link to={`/cases/${id}/edit`} className="hl-interface-btn">
                  <i className="lilicon hl-edit-icon" />
                </Link>

                <button className="hl-interface-btn">
                  <i className="lilicon hl-trashcan-icon" />
                </button>
              </div>
            </div>

            <div className="detail-page">
              <div>
                <ContentBlock
                  title={title}
                  component="caseDetailWidget"
                  className="m-b-25"
                  fullHeight
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
                      <LilyDate date={caseObj.expires} />
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
                        type="select"
                        field="assignedTo"
                        object={caseObj}
                        submitCallback={this.submitCallback}
                      />
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

                <AccountDetailWidget account={caseObj.account} />
              </div>

              <div className="grid-column-2">
                <BlockUI blocking={loading}>
                  <div className="content-block-container m-b-25">
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
                          <FontAwesomeIcon icon="archive" />{' '}
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
          <div>Loading</div>
        )}
      </React.Fragment>
    );
  }
}

export default CaseDetail;
