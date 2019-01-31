import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { NO_SORT_STATUS, ASCENDING_STATUS, DESCENDING_STATUS } from 'lib/constants';

class ListColumns extends Component {
  setSorting = column => {
    const { sortColumn, sortStatus } = this.props;

    let newStatus = sortStatus;

    // Toggle between states if it's the same column.
    if (sortColumn === column) {
      if (sortStatus === NO_SORT_STATUS) {
        newStatus = ASCENDING_STATUS;
      } else if (sortStatus === ASCENDING_STATUS) {
        newStatus = DESCENDING_STATUS;
      } else {
        newStatus = NO_SORT_STATUS;
      }
    } else {
      // If a new column is clicked go back to the first clicked state (ascending).
      newStatus = ASCENDING_STATUS;
    }

    this.props.setSorting(column, newStatus);
  };

  render() {
    const { sortColumn, sortStatus, columns } = this.props;

    return (
      <React.Fragment>
        {columns.map(column => (
          <React.Fragment key={column.key}>
            {column.selected ? (
              <th>
                {column.sort ? (
                  <button className="display-flex" onClick={() => this.setSorting(column.sort)}>
                    <div className="flex-grow">{column.text}</div>

                    {sortColumn === column.sort ? (
                      <React.Fragment>
                        {sortStatus === NO_SORT_STATUS && (
                          <FontAwesomeIcon icon={['far', 'sort']} />
                        )}
                        {sortStatus === ASCENDING_STATUS && (
                          <FontAwesomeIcon icon={['far', 'sort-up']} />
                        )}
                        {sortStatus === DESCENDING_STATUS && (
                          <FontAwesomeIcon icon={['far', 'sort-down']} />
                        )}
                      </React.Fragment>
                    ) : (
                      <FontAwesomeIcon icon={['far', 'sort']} />
                    )}
                  </button>
                ) : (
                  <React.Fragment>{column.text}</React.Fragment>
                )}
              </th>
            ) : null}
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  }
}

export default ListColumns;
