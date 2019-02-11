import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import withContext from 'src/withContext';
import Socket from 'lib/Socket';
import Editable from 'components/Editable';
import ContentBlock from 'components/ContentBlock';
import LilyDate from 'components/Utils/LilyDate';
import ClientDisplay from 'components/Utils/ClientDisplay';
import LoadingIndicator from 'components/Utils/LoadingIndicator';
import ListFilter from 'components/List/ListFilter';
import UserTeam from 'models/UserTeam';
import Settings from 'models/Settings';
import Case from 'models/Case';

class UnassignedCases extends Component {
  constructor(props) {
    super(props);

    this.mounted = false;
    this.settings = new Settings('unassignedCases');

    this.state = {
      items: [],
      caseTypes: [],
      teams: [],
      filters: { list: [], team: [] },
      loading: true
    };
  }

  async componentDidMount() {
    this.mounted = true;

    const { filters } = this.state;
    const { currentUser } = this.props;

    const settingsResponse = await this.settings.get();
    const settings = settingsResponse.results || { filters };
    const caseTypeResponse = await Case.caseTypes();
    const caseTypes = caseTypeResponse.results.map(caseType => {
      caseType.value = `type.id=${caseType.id}`;

      return caseType;
    });
    const teamResponse = await UserTeam.query();
    const teams = teamResponse.results.map(team => {
      team.value = `assignedToTeams.id=${team.id}`;

      if (filters.team.length === 0) {
        const foundTeam = currentUser.teams.find(userTeam => userTeam.id === team.id);

        // Automatically select the user's teams if there's no filters.
        if (foundTeam) {
          settings.filters.team.push(team.value);
        }
      }

      return team;
    });

    if (this.mounted) {
      this.setState(
        {
          ...settings,
          caseTypes,
          teams
        },
        this.loadItems
      );

      Socket.bind('case-unassigned', this.loadItems);
    }
  }

  componentWillUnmount() {
    Socket.unbind('case-unassigned', this.loadItems);

    this.mounted = false;
  }

  loadItems = async () => {
    this.setState({ loading: true });

    const request = await Case.query();
    const total = request.results.length;
    const criticalCount = request.results.filter(item => item.priority === Case.CRITICAL_PRIORITY)
      .length;
    const items = request.results;

    if (this.mounted) {
      this.setState({ items, total, criticalCount, loading: false });
    }
  };

  setFilters = async (newFilters, type) => {
    const { filters } = this.state;

    filters[type] = newFilters;

    await this.setState({ filters });
    await this.settings.store({ filters });

    this.loadItems();
  };

  setTeamFilters = async newFilters => {
    const { filters } = this.state;

    filters.team = newFilters;
    await this.settings.store({ filters });

    this.setState({ filters }, this.loadItems);
  };

  render() {
    const { items, caseTypes, teams, filters, total, criticalCount, loading } = this.state;
    const { t } = this.props;

    const title = (
      <React.Fragment>
        <div className="content-block-label cases" />
        <div className="content-block-name">
          <FontAwesomeIcon icon={['far', 'briefcase']} className="m-r-5" />
          Unassigned cases
          <span className="label-amount">{total || '-'}</span>
          <span className="label-amount high-prio">{criticalCount || '-'}</span>
        </div>
      </React.Fragment>
    );

    const extra = (
      <React.Fragment>
        <ListFilter
          label="Case types"
          items={caseTypes}
          filters={filters.list}
          setFilters={this.setFilters}
        />

        <div className="m-r-10" />

        <ListFilter
          label="Teams"
          items={teams}
          filters={filters.team}
          setFilters={this.setTeamFilters}
        />
      </React.Fragment>
    );

    return (
      <ContentBlock title={title} extra={extra} component="unassignedCases" expandable closeable>
        <table className="hl-table">
          <thead>
            <tr>
              <th>Nr.</th>
              <th>Subject</th>
              <th>Client</th>
              <th>Priority</th>
              <th>Teams</th>
              <th>Created</th>
              <th className="table-actions">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  <Link to={`/cases/${item.id}`}>{item.subject}</Link>
                </td>
                <td>
                  <ClientDisplay contact={item.contact} account={item.account} />
                </td>
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
                  {item.assignedToTeams.map(team => (
                    <div key={team.id}>{team.name}</div>
                  ))}
                </td>
                <td>
                  <LilyDate date={item.created} />
                </td>
                <td>
                  <button className="hl-primary-btn">Assign to me</button>
                </td>
              </tr>
            ))}

            {!loading && items.length === 0 && (
              <tr>
                <td colSpan="7">{t('dashboard.unassignedCases')}</td>
              </tr>
            )}
          </tbody>
        </table>

        {loading && <LoadingIndicator />}
      </ContentBlock>
    );
  }
}

export default withTranslation('emptyStates')(withContext(UnassignedCases));
