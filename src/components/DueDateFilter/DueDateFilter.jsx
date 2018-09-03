import React, { Component } from 'react';
import { addDays, subDays, format } from 'date-fns';

import toggleFilter from 'utils/toggleFilter';

class DueDateFilter extends Component {
  constructor(props) {
    super(props);

    const filterField = props.filterField || 'expires';
    const dateFormat = 'YYYY-MM-dd';
    const date = new Date();

    const options = [
      {
        name: 'Expired',
        value: `${filterField}: [* TO ${format(subDays(date, 1), dateFormat)}]`
      },
      {
        name: 'Today',
        value: `${filterField}: ${format(date, dateFormat)}`
      },
      {
        name: 'Tomorrow',
        value: `${filterField}: ${format(addDays(date, 1), dateFormat)}`
      },
      {
        name: 'Next 7 days',
        value: `${filterField}: [${format(date, dateFormat)} TO ${format(
          addDays(date, 7),
          dateFormat
        )}]`
      },
      {
        name: 'Later',
        value: `${filterField}: [${format(addDays(date, 7), dateFormat)} TO *]`
      }
    ];

    this.options = options;
  }

  toggleFilter = filter => {
    const filters = toggleFilter(this.props.filters, filter);

    this.props.setFilters(filters);
  };

  render() {
    const { filters } = this.props;

    return (
      <div className="filter-group">
        {this.options.map(option => {
          const isSelected = filters.some(filter => filter === option.value);
          const buttonClassName = `hl-primary-btn${isSelected ? ' active' : ''}`;

          return (
            <button
              key={`option-${option.name.toLowerCase()}`}
              className={buttonClassName}
              onClick={() => this.toggleFilter(option.value)}
            >
              {option.name}
            </button>
          );
        })}
      </div>
    );
  }
}

export default DueDateFilter;
