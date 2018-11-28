import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';

import withContext from 'src/withContext';
import updateModel from 'utils/updateModel';
import Editable from 'components/Editable';
import ContentBlock from 'components/ContentBlock';
import LilyDate from 'components/Utils/LilyDate';
import Postpone from 'components/Postpone';
import BlockUI from 'components/Utils/BlockUI';
import LoadingIndicator from 'components/Utils/LoadingIndicator';
import LilyCurrency from 'components/Utils/LilyCurrency';
import AccountDetailWidget from 'components/ContentBlock/AccountDetailWidget';
import ContactDetailWidget from 'components/ContentBlock/ContactDetailWidget';
import ActivityStream from 'components/ActivityStream';
import LilyTooltip from 'components/LilyTooltip';
import Tenant from 'models/Tenant';
import Account from 'models/Account';
import Contact from 'models/Contact';
import Deal from 'models/Deal';

class DealDetail extends Component {
  constructor(props) {
    super(props);

    this.mounted = false;

    const hasPandaDoc = props.currentUser.tenant.integrations.find(
      integration => integration.type === 1
    );

    this.hasPandaDoc = hasPandaDoc;

    const tenantId = props.currentUser.tenant.id;
    this.isVoysNL = Tenant.isVoysNL(tenantId);
    this.showQuoteSection = this.isVoysNL || Tenant.isVoysZA(tenantId);

    this.state = {
      deal: null,
      dealStatuses: [],
      documents: [],
      loading: true
    };
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    const deal = await Deal.get(id);
    const contact = deal.contact ? await Contact.get(deal.contact.id) : null;
    const statusResponse = await Deal.statuses();
    const documentResponse = await Deal.documents(id);

    if (deal.account) {
      deal.account = await Account.get(deal.account.id, { filterDeleted: false });
    }

    if (deal.contact) {
      deal.contact = await Contact.get(deal.contact.id, { filterDeleted: false });
    }

    this.setState({
      deal,
      contact,
      dealStatuses: statusResponse.results,
      documents: documentResponse.results,
      loading: false
    });

    document.title = `${deal.name} - Lily`;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  toggleArchive = async () => {
    const { deal } = this.state;
    const isArchived = !deal.isArchived;

    const args = {
      id: deal.id,
      isArchived
    };

    await this.submitCallback(args);
    deal.isArchived = isArchived;

    this.setState({ deal });
  };

  changeStatus = async status => {
    const { deal } = this.state;

    const args = {
      id: deal.id,
      status: status.id
    };

    await this.submitCallback(args);
    deal.status = status;

    this.setState({ deal });
  };

  submitCallback = async args => {
    const { deal } = this.state;
    this.setState({ loading: true });

    await updateModel(deal, args);

    if (args.hasOwnProperty('quoteId')) {
      // Quote ID doesn't seem to be updated automatically, so update it manually.
      deal.quoteId = args.quoteId;
    }

    this.setState({ deal, loading: false });
  };

  render() {
    const { deal, contact, dealStatuses, documents, loading } = this.state;
    const { t } = this.props;
    const { id } = this.props.match.params;

    const title = (
      <React.Fragment>
        <div className="content-block-label deals" />
        <div className="content-block-name">
          <i className="lilicon hl-deal-icon m-r-5" />
          Deal details
        </div>
      </React.Fragment>
    );

    const documentsTitle = (
      <React.Fragment>
        <div className="content-block-label" />
        <div className="content-block-name">Documents</div>
      </React.Fragment>
    );

    const documentsExtra = deal ? (
      <div data-tip={t('documentContactMissing')}>
        <Link
          to={`/quotes/create/${deal.id}`}
          className={`hl-primary-btn${!deal.contact ? ' is-disabled' : ''}`}
        >
          <FontAwesomeIcon icon="plus" /> Document
        </Link>

        {!deal.contact && <LilyTooltip />}
      </div>
    ) : null;

    return (
      <React.Fragment>
        {deal ? (
          <React.Fragment>
            <div className="detail-page-header">
              <div>
                <Link to={`/deals/${id}/edit`} className="hl-interface-btn">
                  <i className="lilicon hl-edit-icon" />
                </Link>

                <button className="hl-interface-btn">
                  <i className="lilicon hl-trashcan-icon" />
                </button>
              </div>
            </div>

            <div className="detail-page">
              <div>
                <ContentBlock title={title} component="dealDetailWidget" fullHeight>
                  <div className="detail-row">
                    <div>One-time cost</div>
                    <div>
                      <Editable
                        type="text"
                        object={deal}
                        field="amountOnce"
                        submitCallback={this.submitCallback}
                      >
                        <LilyCurrency value={deal.amountOnce} currency={deal.currency} />
                      </Editable>
                    </div>
                  </div>

                  <div className="detail-row">
                    <div>Recurring cost</div>
                    <div>
                      <Editable
                        type="text"
                        object={deal}
                        field="amountRecurring"
                        submitCallback={this.submitCallback}
                      >
                        <LilyCurrency value={deal.amountRecurring} currency={deal.currency} />
                      </Editable>
                    </div>
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

                  {this.showQuoteSection && (
                    <div className="detail-row">
                      <div>Quote</div>
                      <div className="has-editable">
                        <Editable
                          type="text"
                          field="quoteId"
                          object={deal}
                          submitCallback={this.submitCallback}
                        >
                          {deal.quoteId ? (
                            <a
                              href={`https://freedom.voys.${
                                this.isVoysNL ? 'nl' : 'co.za'
                              }/quotes/pdf/${deal.quoteId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {deal.quoteId}
                            </a>
                          ) : (
                            <span className="editable-empty">No quote ID</span>
                          )}
                        </Editable>
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

                {this.hasPandaDoc && (
                  <React.Fragment>
                    <ContentBlock
                      title={documentsTitle}
                      extra={documentsExtra}
                      component="documentListWidget"
                    >
                      <table className="hl-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Contact</th>
                            <th>Status</th>
                            <th className="table-actions">Actions</th>
                          </tr>
                        </thead>

                        <tbody>
                          {documents.map(document => (
                            <tr key={document.id}>
                              <td>
                                <a
                                  href={`https://app.pandadoc.com/a/#/documents/${document.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {document.name}
                                </a>
                              </td>
                              <td>
                                <Link to={`/contacts/${deal.contact.id}`}>
                                  {deal.contact.fullName}
                                </Link>
                              </td>
                              <td>
                                <span
                                  className={`document-status ${document.status.replace(
                                    'document.',
                                    ''
                                  )}`}
                                />
                                <span className="text-capitalize">
                                  {document.status.replace('document.', '')}
                                </span>
                              </td>
                              <td>
                                <a
                                  href={`https://app.pandadoc.com/a/#/documents/${document.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hl-interface-btn"
                                >
                                  <i className="lilicon hl-edit-icon" />
                                </a>

                                {contact.emailAddresses.length > 0 &&
                                  document.status !== 'completed' && (
                                    <Link
                                      to={{
                                        pathname: '/email/compose',
                                        state: {
                                          emailAddress: contact.emailAddresses[0].emailAddress,
                                          documentId: document.id
                                        }
                                      }}
                                      className="hl-interface-btn"
                                    >
                                      <FontAwesomeIcon icon="envelope" />
                                    </Link>
                                  )}
                              </td>
                            </tr>
                          ))}

                          {documents.length === 0 && (
                            <tr>
                              <td colSpan="4">No documents</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </ContentBlock>

                    <div className="m-b-25" />
                  </React.Fragment>
                )}

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
                          <LilyDate date={deal.modified} format="d MMM. yyyy" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {deal.account && (
                  <React.Fragment>
                    <div className="m-b-25" />
                    <AccountDetailWidget
                      clickable
                      account={deal.account}
                      submitCallback={this.submitCallback}
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

                        {deal.nextStepDate && deal.nextStep.name !== 'None' && (
                          <div>
                            <strong>Next step date: </strong>
                            <Postpone object={deal} field="nextStepDate" />
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
                            <LilyDate date={deal.created} format="d MMM. yyyy HH:MM" />
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

                {deal.account && (
                  <React.Fragment>
                    <div className="m-b-25" />

                    <ActivityStream object={deal.account} parentObject={deal} />
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

export default withNamespaces('tooltips')(withContext(DealDetail));
