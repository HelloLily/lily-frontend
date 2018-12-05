import React, { Component } from 'react';
import { addDays, subDays, format } from 'date-fns';

import { API_DATE_FORMAT } from 'lib/constants';
import toggleFilter from 'utils/toggleFilter';

class DueDateFilter extends Component {
  constructor(props) {
    super(props);

    const filterField = props.filterField || 'expires';
    const dateFormat = API_DATE_FORMAT;
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

    if (window.location.pathname !== '/') {
      // Don't show this options when the current page is the dashboard.
      options.unshift({
        name: 'Archived',
        value: ''
      });
    }

    this.options = options;
  }

  toggleFilter = filter => {
    let { filters } = this.props;

    filters = toggleFilter(filters, filter);

    this.props.setFilters(filters, 'dueDate');
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
