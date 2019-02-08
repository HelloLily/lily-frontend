import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ContentBlock from 'components/ContentBlock';
import LilyDate from 'components/Utils/LilyDate';
import LoadingIndicator from 'components/Utils/LoadingIndicator';
import EmailLink from 'components/Utils/EmailLink';
import ListFilter from 'components/List/ListFilter';
import Settings from 'models/Settings';
import EmailMessage from 'models/EmailMessage';
import EmailAccount from 'models/EmailAccount';

class UnreadEmail extends Component {
  constructor(props) {
    super(props);

    this.mounted = false;
    this.settings = new Settings('unreadEmail');

    this.state = {
      items: [],
      emailAccounts: [],
      filters: { list: [] },
      loading: true
    };
  }

  async componentDidMount() {
    this.mounted = true;

    const settingsResponse = await this.settings.get();
    const accountResponse = await EmailAccount.mine();
    const emailAccounts = accountResponse.results.map(emailAccount => {
      emailAccount.value = `account.id: ${emailAccount.id}`;
      // ListFilter expects a name property, so set it here.
      emailAccount.name = emailAccount.label;

      return emailAccount;
    });

    if (this.mounted) {
      this.setState(
        {
          ...settingsResponse.results,
          emailAccounts
        },
        this.loadItems
      );
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  loadItems = async () => {
    this.setState({ loading: true });

    // TODO: Implement inbox filter.
    const response = await EmailMessage.query({});
    const total = response.results.length;
    const items = response.results;

    if (this.mounted) {
      this.setState({ items, total, loading: false });
    }
  };

  setFilters = async (newFilters, type) => {
    const { filters } = this.state;

    filters[type] = newFilters;

    await this.setState({ filters });
    await this.settings.store({ filters });

    this.loadItems();
  };

  render() {
    const { items, emailAccounts, filters, total, loading } = this.state;
    const { t } = this.props;

    const title = (
      <React.Fragment>
        <div className="content-block-label email" />
        <div className="content-block-name">
          <FontAwesomeIcon icon={['far', 'envelope']} className="m-r-5" /> Unread email
          <span className="label-amount">{total || '-'}</span>
        </div>
      </React.Fragment>
    );

    const extra = (
      <ListFilter
        label="Inboxes"
        items={emailAccounts}
        filters={filters.list}
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
                  <EmailLink state={{ emailMessage: item }} className="hl-primary-btn borderless">
                    <FontAwesomeIcon icon={['far', 'reply']} />
                  </EmailLink>
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
