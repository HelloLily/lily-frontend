import React, { Component } from 'react';

import Dropdown from 'components/Dropdown/index';

class ListFilter extends Component {
  toggleFilter = filter => {
    console.log(filter);
  };

  render() {
    const { label, items } = this.props;

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
            <li className="dropdown-menu-item clickable">
              <input id="selectAll" type="checkbox" onClick={() => this.toggleFilter()} />

              <label htmlFor="selectAll">Select all</label>
            </li>

            {items.map(item => (
              <li className="dropdown-menu-item clickable" key={item.id}>
                <input
                  id={item.id}
                  type="checkbox"
                  defaultChecked={item.selected}
                  onClick={() => this.toggleFilter(item)}
                />

                <label htmlFor={item.id}>{item.name}</label>
              </li>
            ))}
          </ul>
        }
      />
    );
  }
}

export default ListFilter;
