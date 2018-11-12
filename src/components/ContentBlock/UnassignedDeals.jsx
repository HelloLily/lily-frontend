import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';

import Editable from 'components/Editable';
import ContentBlock from 'components/ContentBlock';
import LilyDate from 'components/Utils/LilyDate';
import ClientDisplay from 'components/Utils/ClientDisplay';
import LoadingIndicator from 'components/Utils/LoadingIndicator';
import LilyCurrency from 'components/Utils/LilyCurrency';
import ListFilter from 'components/List/ListFilter';
import UserTeam from 'models/UserTeam';
import Settings from 'models/Settings';
import Deal from 'models/Deal';

class UnassignedDeals extends Component {
  constructor(props) {
    super(props);

    this.settings = new Settings('unassignedDeals');

    this.state = {
      items: [],
      nextSteps: [],
      teams: [],
      filters: { list: [] },
      loading: true
    };
  }

  async componentDidMount() {
    const settingsResponse = await this.settings.get();
    const nextStepResponse = await Deal.nextSteps();
    const nextSteps = nextStepResponse.results.map(nextStep => {
      nextStep.value = `nextStep.id: ${nextStep.id}`;

      return nextStep;
    });
    const teamResponse = await UserTeam.query();
    const teams = teamResponse.results.map(team => {
      team.value = `assignedToTeams.id:${team.id}`;

      return team;
    });

    await this.loadItems();

    this.setState({
      ...settingsResponse.results,
      nextSteps,
      teams
    });
  }

  loadItems = async () => {
    this.setState({ loading: true });

    const request = await Deal.query();
    const total = request.results.length;
    const items = request.results;

    this.setState({ items, total, loading: false });
  };

  setFilters = async filters => {
    await this.settings.store({ filters });

    this.setState({ filters }, this.loadItems);
  };

  render() {
    const { items, nextSteps, teams, filters, total, loading } = this.state;
    const { t } = this.props;

    const title = (
      <React.Fragment>
        <div className="content-block-label deals" />
        <div className="content-block-name">
          <i className="lilicon hl-deals-icon m-r-5" />
          Unassigned deals
          <span className="label-amount">{total || '-'}</span>
        </div>
      </React.Fragment>
    );

    const extra = (
      <React.Fragment>
        <ListFilter
          label="Next steps"
          items={nextSteps}
          filters={filters}
          setFilters={this.setFilters}
        />

        <ListFilter label="Teams" items={teams} filters={filters} setFilters={this.setFilters} />
      </React.Fragment>
    );

    return (
      <ContentBlock title={title} extra={extra} component="unassignedDeals" expandable closeable>
        <table className="hl-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Client</th>
              <th>Deal size</th>
              <th>Teams</th>
              <th>Next step</th>
              <th>Next step date</th>
              <th className="table-actions">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>
                  <Link to={`/deals/${item.id}`}>{item.name}</Link>
                </td>
                <td>
                  <ClientDisplay contact={item.contact} account={item.account} />
                </td>
                <td>
                  {item.amountOnce !== 0 && (
                    <span>
                      <LilyCurrency value={item.amountOnce} currency={item.currency} /> /month
                    </span>
                  )}
                  {item.amountOnce !== 0 && item.amountRecurring !== 0 && <span> | </span>}
                  {item.amountRecurring !== 0 && (
                    <span>
                      <LilyCurrency value={item.amountRecurring} currency={item.currency} />{' '}
                      /recurring
                    </span>
                  )}
                </td>
                <td>
                  {item.assignedToTeams.map(team => (
                    <div key={team.id}>{team.name}</div>
                  ))}
                </td>
                <td>
                  <Editable
                    type="select"
                    object={item}
                    field="nextStep"
                    submitCallback={this.submitCallback}
                    icon
                  />
                </td>
                <td>
                  <LilyDate date={item.nextStepDate} />
                </td>
                <td>
                  <button className="hl-primary-btn">Assign to me</button>
                </td>
              </tr>
            ))}

            {!loading && items.length === 0 && (
              <tr>
                <td colSpan="7">{t('dashboard.unassignedDeals')}</td>
              </tr>
            )}
          </tbody>
        </table>

        {loading && <LoadingIndicator />}
      </ContentBlock>
    );
  }
}

export default withNamespaces('emptyStates')(UnassignedDeals);
