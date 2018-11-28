import React, { Component } from 'react';

import withContext from 'src/withContext';
import LoadingIndicator from 'components/Utils/LoadingIndicator';
import toggleFilter from 'utils/toggleFilter';
import Dropdown from 'components/Dropdown';
import UserTeam from 'models/UserTeam';
import User from 'models/User';

class UserFilter extends Component {
  constructor(props) {
    super(props);

    this.mounted = false;
    this.currentUserValue = `assignedTo.id: ${props.currentUser.id}`;

    this.state = {
      teams: [],
      loading: true
    };
  }

  async componentDidMount() {
    this.mounted = true;

    const { currentUser } = this.props;

    const teamResponse = await UserTeam.query();
    const teams = teamResponse.results.map(team => {
      team.value = `assignedToTeams.id=${team.id}`;
      // Expand the team if the current user is part of that team.
      team.collapsed = currentUser.teams.findIndex(userTeam => userTeam.id === team.id) === -1;
      // The current user is always displayed at the top of the user filter.
      // So filter it out of the team's users.
      team.users = team.users.reduce((acc, user) => {
        if (user.id !== currentUser.id) {
          user.value = `assignedTo.id=${user.id}`;

          acc.push(user);
        }

        return acc;
      }, []);

      return team;
    });

    const userResponse = await User.unassigned();
    const teamlessUsers = userResponse.results.map(user => {
      user.value = `assignedTo.id=${user.id}`;

      return user;
    });

    if (teamlessUsers.length > 0) {
      teams.push({
        id: 'teamless',
        name: 'Not in team',
        value: '',
        users: teamlessUsers,
        collapsed: true
      });
    }

    teams.push({
      id: 'unassigned',
      name: 'Unassigned',
      value: '(_missing_:assignedTo.id AND _missing_:assignedToTeams)',
      users: [],
      collapsed: true
    });

    if (this.mounted) {
      this.setState({ teams, loading: false });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  getDisplay = () => {
    const { teams } = this.state;
    const filters = this.props.filters.user;

    const display = [];

    if (filters.includes(this.currentUserValue)) {
      display.push(this.props.currentUser.fullName);
    }

    teams.forEach(team => {
      if (filters.includes(team.value)) {
        display.push(team.name);
      }

      team.users.forEach(user => {
        if (filters.includes(user.value) && !display.includes(user.fullName)) {
          display.push(user.fullName);
        }
      });
    });

    return display;
  };

  toggleCollapse = selectedTeam => {
    const { teams } = this.state;

    const index = teams.findIndex(team => team.id === selectedTeam.id);
    teams[index].collapsed = !teams[index].collapsed;

    this.setState({ teams });
  };

  toggleFilter = filter => {
    const { filters } = this.props;

    filters.user = toggleFilter(this.props.filters.user, filter);

    this.props.setFilters(filters);
  };

  toggleTeam = team => {
    const { filters } = this.props;

    const teamSelected = filters.user.includes(team.value);
    // Filter items which haven't been selected.
    const filteredItems = team.users.filter(
      item => !filters.user.some(filter => filter === item.value)
    );

    if (!teamSelected) {
      filteredItems.push(team);
    }

    let newFilters = team.users.slice();

    if (filteredItems.length > 0) {
      // Not everything has been selected, so select the unselected items.
      newFilters = filteredItems;
    } else if (teamSelected && filteredItems.length === 0) {
      newFilters.push(team);
    }

    // Toggle all filters which haven't been selected.
    filters.user = newFilters.reduce((acc, item) => toggleFilter(acc, item.value), filters.user);

    this.props.setFilters(filters);
  };

  clearFilters = () => {
    const { filters } = this.props;

    filters.user = [];

    this.props.setFilters(filters);
  };

  render() {
    const { teams, loading } = this.state;
    const { currentUser } = this.props;
    const filters = this.props.filters.user;

    const display = this.getDisplay();

    return (
      <Dropdown
        clearCallback={filters.length > 0 ? this.clearFilters : null}
        clickable={
          <button className="hl-primary-btn filter-btn" onClick={this.showMenu}>
            <i className="lilicon hl-entities-icon" />
            <span className="m-l-5 m-r-5">
              {display.length === 0 && <React.Fragment>Colleagues</React.Fragment>}

              {display.length > 2 ? (
                <React.Fragment>{display.length} selected</React.Fragment>
              ) : (
                <React.Fragment>{display.join(', ')}</React.Fragment>
              )}
            </span>
            <i className="lilicon hl-toggle-down-icon small" />
          </button>
        }
        menu={
          <React.Fragment>
            <ul className="dropdown-menu">
              {!loading ? (
                <React.Fragment>
                  <li className="dropdown-menu-item">
                    <input
                      id={currentUser.id}
                      type="checkbox"
                      checked={filters.includes(this.currentUserValue)}
                      onChange={() => this.toggleFilter(this.currentUserValue)}
                    />

                    <label htmlFor={currentUser.id}>{currentUser.fullName}</label>
                  </li>

                  {teams.map(team => {
                    const teamSelected = filters.some(filter => filter === team.value);
                    const filteredItems = team.users.filter(
                      item => !filters.some(filter => filter === item.value)
                    );
                    // Main item is considered selected if every sub item has been selected.
                    const isSelected = teamSelected && filteredItems.length === 0;
                    const teamKey = `team-${team.id}`;

                    return (
                      <React.Fragment key={teamKey}>
                        {team.id === 'unassigned' || team.users.length > 0 ? (
                          <React.Fragment>
                            <li className="dropdown-menu-item">
                              <input
                                id={teamKey}
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => this.toggleTeam(team)}
                              />

                              <label htmlFor={teamKey}>{team.name}</label>

                              {team.id !== 'unassigned' && (
                                <button
                                  className="hl-interface-btn"
                                  onClick={() => this.toggleCollapse(team)}
                                >
                                  <i
                                    className={`lilicon hl-toggle-${
                                      team.collapsed ? 'down' : 'up'
                                    }-icon`}
                                  />
                                </button>
                              )}
                            </li>
                            {!team.collapsed && team.users.length > 0 && (
                              <ul className="dropdown-menu-sub">
                                <li className="dropdown-menu-sub-item" key={`user-team-${team.id}`}>
                                  <input
                                    id={`${team.id}-filter`}
                                    type="checkbox"
                                    checked={teamSelected}
                                    onChange={() => this.toggleFilter(team.value)}
                                  />

                                  <label htmlFor={`${team.id}-filter`}>
                                    {team.id !== 'teamless' ? (
                                      <React.Fragment>{team.name} team</React.Fragment>
                                    ) : (
                                      <React.Fragment>{team.name}</React.Fragment>
                                    )}
                                  </label>
                                </li>

                                {team.users.map(user => {
                                  const userSelected = filters.some(
                                    filter => filter === user.value
                                  );
                                  const userKey = `user-${user.id}`;

                                  return (
                                    <li className="dropdown-menu-sub-item" key={userKey}>
                                      <input
                                        id={userKey}
                                        type="checkbox"
                                        checked={userSelected}
                                        onChange={() => this.toggleFilter(user.value)}
                                      />

                                      <label htmlFor={userKey}>{user.fullName}</label>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </React.Fragment>
                        ) : null}
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              ) : (
                <LoadingIndicator />
              )}
            </ul>
          </React.Fragment>
        }
      />
    );
  }
}

export default withContext(UserFilter);
