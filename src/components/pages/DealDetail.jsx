import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import Editable from 'components/Editable';
import Widget from 'components/Widget';
import LilyDate from 'components/Utils/LilyDate';
import AccountDetailWidget from 'components/Widget/AccountDetailWidget';
import ContactDetailWidget from 'components/Widget/ContactDetailWidget';
import ActivityStream from 'components/ActivityStream';
import Account from 'models/Account';
import Contact from 'models/Contact';
import Deal from 'models/Deal';

class DealDetail extends Component {
  constructor(props) {
    super(props);

    this.state = { deal: null, dealStatuses: [] };
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    const deal = await Deal.get(id);
    const statusRequest = await Deal.getStatuses();

    if (deal.account) {
      deal.account = await Account.get(deal.account.id);
    }

    if (deal.contact) {
      deal.contact = await Contact.get(deal.contact.id);
    }

    this.setState({ deal, dealStatuses: statusRequest.results });
  }

  toggleArchive = () => {
    const { deal } = this.state;
    const isArchived = !deal.isArchived;

    const args = {
      id: deal.id,
      isArchived
    };

    this.submitCallback(args).then(() => {
      deal.isArchived = isArchived;

      this.setState({ deal });
    });
  };

  changeStatus = status => {
    const { deal } = this.state;

    const args = {
      id: deal.id,
      status: status.id
    };

    this.submitCallback(args).then(() => {
      deal.status = status;

      this.setState({ deal });
    });
  };

  updateModel = (data, field) => {
    const { deal } = this.state;

    const args = {};
  };

  submitCallback = args => Deal.patch(args);

  render() {
    const { deal, dealStatuses } = this.state;

    const title = (
      <React.Fragment>
        <div className="widget-label deals" />
        <div className="widget-name">
          <i className="lilicon hl-deal-icon m-r-5" />
          Deal details
        </div>
      </React.Fragment>
    );

    return (
      <React.Fragment>
        {deal ? (
          <div className="detail-page">
            <div>
              <Widget title={title} component="dealDetailWidget">
                <div className="detail-row">
                  <div>One-time cost</div>
                  <div>{deal.amountOnce}</div>
                </div>

                <div className="detail-row">
                  <div>Recurring cost</div>
                  <div>{deal.amountRecurring}</div>
                </div>

                {deal.whyLost && (
                  <div className="detail-row">
                    <div>Why lost</div>
                    <div>
                      <Editable
                        type="select"
                        field="whyLost"
                        object={deal}
                        submitCallback={this.submitCallback}
                      />
                    </div>
                  </div>
                )}

                {deal.closedDate && (
                  <div className="detail-row">
                    <div>Closed date</div>
                    <div>
                      <LilyDate date={deal.closedDate} />
                    </div>
                  </div>
                )}

                {(deal.foundThrough || deal.contactedBy || deal.whyCustomer) && (
                  <React.Fragment>
                    <div className="detail-row">
                      <div>Found through</div>
                      <div>
                        <Editable
                          type="select"
                          field="foundThrough"
                          object={deal}
                          submitCallback={this.submitCallback}
                        />
                      </div>
                    </div>

                    <div className="detail-row">
                      <div>Contacted by</div>
                      <div>
                        <Editable
                          type="select"
                          field="contactedBy"
                          object={deal}
                          submitCallback={this.submitCallback}
                        />
                      </div>
                    </div>

                    <div className="detail-row">
                      <div>Why customer</div>
                      <div>
                        <Editable
                          type="select"
                          field="whyCustomer"
                          object={deal}
                          submitCallback={this.submitCallback}
                        />
                      </div>
                    </div>
                  </React.Fragment>
                )}

                <div className="detail-row">
                  <div>
                    <FontAwesomeIcon icon="tags" /> Tags
                  </div>
                  <div>
                    <Editable
                      multi
                      type="tags"
                      field="tags"
                      object={deal}
                      submitCallback={this.submitCallback}
                    />
                  </div>
                </div>
              </Widget>

              <div className="m-b-25" />

              <div className="widget-container">
                <div className="widget">
                  <div className="widget-header">
                    <div className="widget-label" />
                    <div className="widget-name">Involved</div>
                  </div>

                  <div>
                    <div className="detail-row">
                      <div>Assigned to</div>
                      <div>
                        <Editable
                          async
                          type="select"
                          field="assignedTo"
                          object={deal}
                          submitCallback={this.submitCallback}
                        />
                      </div>
                    </div>

                    <div className="detail-row">
                      <div>Assigned to teams</div>
                      <div>
                        <Editable
                          multi
                          type="select"
                          field="assignedToTeams"
                          object={deal}
                          submitCallback={this.submitCallback}
                        />
                      </div>
                    </div>

                    <div className="detail-row">
                      <div>Created by</div>
                      <div>
                        {deal.createdBy ? deal.createdBy.fullName : 'Unknown'}

                        <span>
                          {' '}
                          on <LilyDate date={deal.created} />
                        </span>
                      </div>
                    </div>

                    <div className="detail-row">
                      <div>Last edited</div>
                      <div>
                        <LilyDate date={deal.modified} format="D MMM. YYYY" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {deal.account && (
                <React.Fragment>
                  <div className="m-b-25" />
                  <AccountDetailWidget
                    account={deal.account}
                    submitCallback={this.submitCallback}
                    clickable
                  />
                </React.Fragment>
              )}

              {deal.contact && (
                <React.Fragment>
                  <div className="m-b-25" />
                  <ContactDetailWidget
                    contact={deal.contact}
                    submitCallback={this.submitCallback}
                    clickable
                  />
                </React.Fragment>
              )}
            </div>

            <div className="grid-column-2">
              <div className="widget-container m-b-25">
                <div className="widget">
                  <div className="widget-header space-between">
                    <div className={`hl-btn-group${deal.isArchived ? ' is-disabled' : ''}`}>
                      {dealStatuses.map(status => (
                        <button
                          key={status.id}
                          className={`hl-primary-btn${
                            status.id === deal.status.id ? ' selected' : ''
                          }`}
                          onClick={() => this.changeStatus(status)}
                        >
                          {status.name}
                        </button>
                      ))}
                    </div>

                    <button className="hl-primary-btn" onClick={this.toggleArchive}>
                      <FontAwesomeIcon icon="archive" /> {deal.isArchived ? 'Unarchive' : 'Archive'}
                    </button>
                  </div>

                  <div className="widget-header space-between">
                    <div>
                      <strong>Next step: </strong>
                      <Editable
                        icon
                        type="select"
                        field="nextStep"
                        object={deal}
                        submitCallback={this.submitCallback}
                      />
                    </div>

                    {deal.nextStepDate &&
                      deal.nextStep.name !== 'None' && (
                        <div>
                          <strong>Next step date: </strong>
                          <LilyDate date={deal.nextStepDate} />.
                        </div>
                      )}
                  </div>

                  <div className="widget-content">
                    <div className="display-flex space-between">
                      <strong>
                        <Editable
                          type="text"
                          object={deal}
                          field="name"
                          submitCallback={this.submitCallback}
                        />
                      </strong>

                      <div className="text-muted">
                        <LilyDate date={deal.created} format="D MMM. YYYY HH:MM" />
                      </div>
                    </div>

                    <Editable
                      type="textarea"
                      object={deal}
                      field="description"
                      submitCallback={this.submitCallback}
                    />
                  </div>
                </div>
              </div>

              <ActivityStream object={deal} />
            </div>
          </div>
        ) : (
          <div>Loading</div>
        )}
      </React.Fragment>
    );
  }
}

export default DealDetail;
