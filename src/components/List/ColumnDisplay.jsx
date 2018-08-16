import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Dropdown from 'components/Dropdown';

const ColumnDisplay = ({ className, columns, toggleColumn }) => (
  <Dropdown
    clickable={
      <div className={className || ''}>
        <button className="hl-primary-btn">
          <FontAwesomeIcon icon="columns" />
          <span className="m-l-5 m-r-5">Columns</span>
          <i className="lilicon hl-toggle-down-icon small" />
        </button>
      </div>
    }
    menu={
      <ul className="dropdown-menu">
        {columns.map((column, index) => (
          <li className="dropdown-menu-item clickable" key={column.key}>
            <input
              id={column.key}
              type="checkbox"
              defaultChecked={column.selected}
              onClick={() => toggleColumn(index)}
            />

            <label htmlFor={column.key}>{column.text}</label>
          </li>
        ))}
      </ul>
    }
  />
);

export default ColumnDisplay;
