import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withNamespaces } from 'react-i18next';

import toggleFilter from 'utils/toggleFilter';
import LilyTooltip from 'components/LilyTooltip';
import Dropdown from 'components/Dropdown';

class ListFilter extends Component {
  getDisplay = () => {
    const { items, filters } = this.props;

    const display = [];

    items.forEach(item => {
      if (filters.includes(item.value)) {
        display.push(item.name);
      }
    });

    return display;
  };

  toggleFilter = filter => {
    let { filters } = this.props;

    filters = toggleFilter(filters, filter);

    this.props.setFilters(filters, 'list');
  };

  toggleAll = () => {
    const { items } = this.props;
    let { filters } = this.props;

    // Filter items which haven't been selected.
    const filteredItems = items.filter(item => !filters.some(filter => filter === item.value));

    let newFilters = items;

    if (filteredItems.length > 0) {
      // Not everything has been selected, so select the unselected items.
      newFilters = filteredItems;
    }

    // Toggle all filters which haven't been selected.
    newFilters = newFilters.reduce((acc, item) => toggleFilter(acc, item.value), filters);

    filters = newFilters;

    this.props.setFilters(filters, 'list');
  };

  clearFilters = () => {
    const filters = [];

    this.props.setFilters(filters, 'list');
  };

  render() {
    const { label, filters, items, t } = this.props;

    const filteredItems = items.filter(item => !filters.some(filter => filter === item.value));
    const allSelected = filteredItems.length === 0;
    const display = this.getDisplay();

    return (
      <Dropdown
        clearCallback={display.length > 0 ? this.clearFilters : null}
        clickable={
          <button className="hl-primary-btn filter-btn">
            <i className="lilicon hl-cog-icon" />
            <span className="m-l-5 m-r-5">
              {display.length === 0 && <React.Fragment>{label}</React.Fragment>}

              {display.length > 2 ? (
                <React.Fragment>
                  {display.length} {label} selected
                </React.Fragment>
              ) : (
                <React.Fragment>{display.join(' + ')}</React.Fragment>
              )}
            </span>
            <i className="lilicon hl-toggle-down-icon small" />
          </button>
        }
        menu={
          <ul className="dropdown-menu">
            <li className="dropdown-menu-item">
              <input
                id="selectAll"
                type="checkbox"
                checked={allSelected}
                onChange={this.toggleAll}
              />

              <label htmlFor="selectAll">{allSelected ? 'Deselect all' : 'Select all'}</label>
            </li>

            {items.map((item, index) => {
              const isSelected = filters.some(filter => filter === item.value);

              return (
                <li className="dropdown-menu-item" key={item.id}>
                  <input
                    id={item.id}
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => this.toggleFilter(item.value)}
                  />

                  <label htmlFor={item.id}>{item.name}</label>

                  {item.isArchived && (
                    <React.Fragment>
                      <FontAwesomeIcon
                        icon="archive"
                        data-tip={t('filterArchived')}
                        data-for={`filter-${index}`}
                      />

                      <LilyTooltip id={`filter-${index}`} />
                    </React.Fragment>
                  )}
                </li>
              );
            })}
          </ul>
        }
      />
    );
  }
}

export default withNamespaces('tooltips')(ListFilter);
