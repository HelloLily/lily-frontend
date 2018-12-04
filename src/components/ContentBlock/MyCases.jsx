import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withNamespaces } from 'react-i18next';

import withContext from 'src/withContext';
import timeCategorize from 'utils/timeCategorize';
import updateModel from 'utils/updateModel';
import Postpone from 'components/Postpone';
import Editable from 'components/Editable';
import ContentBlock from 'components/ContentBlock';
import ClientDisplay from 'components/Utils/ClientDisplay';
import LoadingIndicator from 'components/Utils/LoadingIndicator';
import UserFilter from 'components/UserFilter';
import DueDateFilter from 'components/DueDateFilter';
import LilyTooltip from 'components/LilyTooltip';
import Settings from 'models/Settings';
import Case from 'models/Case';

class MyCases extends Component {
  constructor(props) {
    super(props);

    this.mounted = false;
    this.settings = new Settings('myCases');

    this.state = {
      items: [],
      filters: { dueDate: [], user: [] },
      loading: true
    };
  }

  async componentDidMount() {
    this.mounted = true;

    const settingsResponse = await this.settings.get();

    if (this.mounted) {
      this.setState({ ...settingsResponse.results }, this.loadItems);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  loadItems = async () => {
    this.setState({ loading: true });

    const request = await Case.query();
    const total = request.results.length;
    const criticalCount = request.results.filter(item => item.priority === Case.CRITICAL_PRIORITY)
      .length;
    const items = timeCategorize(request.results, 'expires', this.props.currentUser);

    if (this.mounted) {
      this.setState({ items, total, criticalCount, loading: false });
    }
  };

  setFilters = async newFilters => {
    const { filters } = this.state;

    filters.list = newFilters;

    await this.setState({ filters });
    await this.settings.store({ filters });

    this.loadItems();
  };

  acceptCase = async item => {
    this.setState({ loading: true });

    const args = {
      id: item.id,
      newlyAssigned: false
    };

    await updateModel(item, args);
    await this.loadItems();
  };

  render() {
    const { items, total, criticalCount, filters, loading } = this.state;
    const { currentUser, t } = this.props;

    const hasCompleted = filters.dueDate.length > 0 && filters.user.length > 0;

    const title = (
      <React.Fragment>
        <div className="content-block-label cases" />
        <div className="content-block-name">
          <i className="lilicon hl-case-icon m-r-5" />
          My cases
          <span className="label-amount">{total || '-'}</span>
          <span className="label-amount high-prio">{criticalCount || '-'}</span>
        </div>
      </React.Fragment>
    );

    const extra = (
      <React.Fragment>
        <DueDateFilter filters={filters} setFilters={this.setFilters} />

        <UserFilter filters={filters} setFilters={this.setFilters} />
      </React.Fragment>
    );

    const acceptTooltip = t('tooltips:newlyAssignedCase');
    const categories = [];

    Object.keys(items).forEach(key => {
      const newlyAssigned = key === 'newlyAssigned';

      const tbody = (
        <tbody key={key}>
          {items[key].length > 0 && (
            <tr className="table-category">
              {newlyAssigned ? (
                <td colSpan="8">Newly assigned to you</td>
              ) : (
                <td colSpan="8" className="text-capitalize">
                  {key}
                </td>
              )}
            </tr>
          )}
          {items[key].map(item => (
            <tr key={item.id} className={newlyAssigned ? 'newly-assigned' : ''}>
              <td>{item.id}</td>
              <td>
                <Link to={`/cases/${item.id}`}>{item.subject}</Link>
              </td>
              <td>
                <ClientDisplay contact={item.contact} account={item.account} />
              </td>
              <td>{item.type.name}</td>
              <td>{item.status.name}</td>
              <td>
                <Editable
                  type="select"
                  object={item}
                  field="priority"
                  submitCallback={this.submitCallback}
                  icon
                  hideValue
                />
              </td>
              <td>
                <Postpone object={item} field="expires" />
              </td>
              <td>
                {newlyAssigned && (
                  <React.Fragment>
                    <button
                      className="hl-primary-btn round"
                      onClick={() => this.acceptCase(item)}
                      data-tip={acceptTooltip}
                      data-for={`case-${item.id}-accept`}
                    >
                      <FontAwesomeIcon icon="check" />
                    </button>

                    <LilyTooltip id={`case-${item.id}-accept`} />
                  </React.Fragment>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      );

      categories.push(tbody);
    });

    return (
      <ContentBlock title={title} extra={extra} component="myCases" expandable closeable>
        <table className="hl-table">
          <thead>
            <tr>
              <th>Nr.</th>
              <th>Subject</th>
              <th>Client</th>
              <th>Type</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Expires</th>
              <th className="table-actions">Actions</th>
            </tr>
          </thead>

          {categories}

          {total === 0 && (
            <tbody>
              <tr>
                <td colSpan="8">
                  {hasCompleted ? (
                    <span>{t('emptyStates:dashboard.myCasesCompleted')}</span>
                  ) : (
                    <span>No cases</span>
                  )}
                </td>
              </tr>
            </tbody>
          )}
        </table>

        {currentUser.objectCounts.cases === 1 && (
          <div className="empty-state-description">
            <p>{t('emptyStates:dashboard.myCases')}</p>
          </div>
        )}

        {loading && <LoadingIndicator />}
      </ContentBlock>
    );
  }
}

export default withNamespaces(['emptyStates', 'tooltips'])(withContext(MyCases));
