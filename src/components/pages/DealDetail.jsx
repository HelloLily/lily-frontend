import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Editable from 'components/Editable';
import ContentBlock from 'components/ContentBlock';
import LilyDate from 'components/Utils/LilyDate';
import AccountDetailWidget from 'components/ContentBlock/AccountDetailWidget';
import ContactDetailWidget from 'components/ContentBlock/ContactDetailWidget';
import ActivityStream from 'components/ActivityStream';
import Account from 'models/Account';
import Contact from 'models/Contact';
import Deal from 'models/Deal';
import BlockUI from 'src/components/Utils/BlockUI';

class DealDetail extends Component {
  constructor(props) {
    super(props);

    this.state = { deal: null, dealStatuses: [], loading: true };
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    const deal = await Deal.get(id);
    const statusRequest = await Deal.statuses();

    if (deal.account) {
      deal.account = await Account.get(deal.account.id);
    }

    if (deal.contact) {
      deal.contact = await Contact.get(deal.contact.id);
    }

    this.setState({ deal, dealStatuses: statusRequest.results, loading: false });
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

  submitCallback = args => {
    this.setState({ loading: true });

    return Deal.patch(args).then(() => {
      this.setState({ loading: false });
    });
  };

  render() {
    const { deal, dealStatuses, loading } = this.state;

    const title = (
      <React.Fragment>
        <div className="content-block-label deals" />
        <div className="content-block-name">
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
              <ContentBlock title={title} component="dealDetailWidget" fullHeight>
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
                    <div className="has-editable">
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
                      <div className="has-editable">
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
                      <div className="has-editable">
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
                      <div className="has-editable">
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
                  <div>Tags</div>
                  <div className="has-editable">
                    <Editable
                      multi
                      type="tags"
                      field="tags"
                      object={deal}
                      submitCallback={this.submitCallback}
                    />
                  </div>
                </div>
              </ContentBlock>

              <div className="m-b-25" />

              <div className="content-block-container">
                <div className="content-block">
                  <div className="content-block-header">
                    <div className="content-block-label" />
                    <div className="content-block-name">Involved</div>
                  </div>

                  <div>
                    <div className="detail-row">
                      <div>Assigned to</div>
                      <div className="has-editable">
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
                      <div className="has-editable">
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
                          {' on '} <LilyDate date={deal.created} />
                        </span>
                      </div>
                    </div>

                    <div className="detail-row">
                      <div>Last edited</div>
                      <div>
                        <LilyDate date={deal.modified} format="d MMM. YYYY" />
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
              <BlockUI blocking={loading}>
                <div className="content-block-container m-b-25">
                  <div className="content-block">
                    <div className="content-block-header space-between">
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
                        <FontAwesomeIcon icon="archive" />{' '}
                        {deal.isArchived ? 'Unarchive' : 'Archive'}
                      </button>
                    </div>

                    <div className="content-block-header space-between">
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

                    <div className="content-block-content">
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
                          <LilyDate date={deal.created} format="d MMM. YYYY HH:MM" />
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
              </BlockUI>

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
