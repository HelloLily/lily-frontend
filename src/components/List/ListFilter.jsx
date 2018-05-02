import React, { Component } from 'react';

class ListFilter extends Component {
  constructor() {
    super();

    this.state = {
      showMenu: false
    };
  }

  showMenu = event => {
    event.preventDefault();

    this.setState({ showMenu: true }, () => {
      document.addEventListener('click', this.closeMenu);
    });
  }

  closeMenu = event => {
    if (!this.dropdownMenu.contains(event.target)) {
      this.setState({ showMenu: false }, () => {
        document.removeEventListener('click', this.closeMenu);
      });
    }
  }

  render() {
    const { label, items } = this.props;

    return (
      <div className="list-filter-container">
        <button className="hl-primary-btn" onClick={this.showMenu}>
          <i className="lilicon hl-cog-icon" />
          <span className="m-l-5 m-r-5">{label}</span>
          <i className="lilicon hl-toggle-down-icon small" />
        </button>

        {
          this.state.showMenu
            ? (
              <ul
                className="list-filter m-t-5"
                ref={element => { this.dropdownMenu = element; }}
              >
                <li className="filter-item">
                  <input type="checkbox" /> Select all
                </li>

                {items.map(item => (
                  <li className="filter-item" key={item.id}>
                    <input type="checkbox" /> {item.name}
                  </li>
                ))}
              </ul>
            )
            : (
              null
            )
        }
      </div>
    );
  }
}

export default ListFilter;
