import React, { Component } from 'react';

import toggleFilter from 'utils/toggleFilter';
import Dropdown from 'components/Dropdown';

class ListFilter extends Component {
  toggleFilter = filter => {
    const filters = toggleFilter(this.props.filters, filter);

    this.props.setFilters(filters);
  };

  toggleAll = () => {
    const { items, filters } = this.props;

    // Filter items which haven't been selected.
    const filteredItems = items.filter(item => !filters.some(filter => filter === item.value));

    let newFilters = items;

    if (filteredItems.length > 0) {
      // Not everything has been selected, so select the unselected items.
      newFilters = filteredItems;
    }

    // Toggle all filters which haven't been selected.
    newFilters = newFilters.reduce((acc, item) => toggleFilter(acc, item.value), filters);

    this.props.setFilters(newFilters);
  };

  render() {
    const { label, items, filters } = this.props;
    const filteredItems = items.filter(item => !filters.some(filter => filter === item.value));
    const allSelected = filteredItems.length === 0;

    return (
      <Dropdown
        clickable={
          <button className="hl-primary-btn" onClick={this.showMenu}>
            <i className="lilicon hl-cog-icon" />
            <span className="m-l-5 m-r-5">{label}</span>
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

            {items.map(item => {
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
                </li>
              );
            })}
          </ul>
        }
      />
    );
  }
}

export default ListFilter;
