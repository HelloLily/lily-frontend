import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ContentBlock from 'components/ContentBlock';
import LilyDate from 'components/Utils/LilyDate';
import LoadingIndicator from 'components/Utils/LoadingIndicator';
import ListFilter from 'components/List/ListFilter';
import Settings from 'models/Settings';
import EmailMessage from 'models/EmailMessage';
import EmailAccount from 'models/EmailAccount';

class UnreadEmail extends Component {
  constructor(props) {
    super(props);

    this.settings = new Settings('unreadEmail');

    this.state = {
      items: [],
      emailAccounts: [],
      filters: { list: [] },
      loading: true
    };
  }

  async componentDidMount() {
    const settingsResponse = await this.settings.get();
    const accountResponse = await EmailAccount.mine();
    const emailAccounts = accountResponse.results.map(emailAccount => {
      emailAccount.value = `account.id: ${emailAccount.id}`;
      // ListFilter expects a name property, so set it here.
      emailAccount.name = emailAccount.label;

      return emailAccount;
    });

    await this.loadItems();

    this.setState({
      ...settingsResponse.results,
      emailAccounts
    });
  }

  loadItems = async () => {
    this.setState({ loading: true });

    const response = await EmailMessage.query({});
    // TODO: Change hits to results once email API is done.
    const total = response.hits.length;
    const items = response.hits;

    this.setState({ items, total, loading: false });
  };

  setFilters = async filters => {
    await this.settings.store({ filters });

    this.setState({ filters }, this.loadItems);
  };

  render() {
    const { items, emailAccounts, filters, total, loading } = this.state;
    const { t } = this.props;

    const title = (
      <React.Fragment>
        <div className="content-block-label email" />
        <div className="content-block-name">
          <i className="lilicon hl-email-icon m-r-5" />
          Unread email
          <span className="label-amount">{total || '-'}</span>
        </div>
      </React.Fragment>
    );

    const extra = (
      <ListFilter
        label="Inboxes"
        items={emailAccounts}
        filters={filters}
        setFilters={this.setFilters}
      />
    );

    return (
      <ContentBlock title={title} extra={extra} component="unreadEmail" expandable closeable>
        <table className="hl-table">
          <thead>
            <tr>
              <th>Mailbox</th>
              <th>From</th>
              <th>Subject</th>
              <th>Sent</th>
              <th className="table-actions">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.account.name}</td>
                <td>{item.senderName || item.senderEmail}</td>
                <td>
                  <Link to={`/email/${item.id}`}>{item.subject}</Link>
                </td>
                <td>
                  <LilyDate date={item.sentDate} showTime />
                </td>
                <td>
                  <Link to={`/email/compose/${item.id}`} className="hl-primary-btn borderless">
                    <FontAwesomeIcon icon="reply" />
                  </Link>
                </td>
              </tr>
            ))}

            {!loading && items.length === 0 && (
              <tr>
                <td colSpan="5">{t('dashboard.unreadEmail')}</td>
              </tr>
            )}
          </tbody>
        </table>

        {loading && <LoadingIndicator />}
      </ContentBlock>
    );
  }
}

export default withNamespaces('emptyStates')(UnreadEmail);
