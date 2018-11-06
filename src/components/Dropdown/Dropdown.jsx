import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuOpen: false
    };
  }

  showMenu = event => {
    event.preventDefault();

    this.setState({ menuOpen: true }, () => {
      document.addEventListener('click', this.closeMenu);
    });
  };

  closeMenu = event => {
    if (this.dropdownMenu && !this.dropdownMenu.contains(event.target)) {
      this.setState({ menuOpen: false }, () => {
        document.removeEventListener('click', this.closeMenu);
      });
    }
  };

  render() {
    const { menuOpen } = this.state;
    const { clickable, menu, clearCallback, className } = this.props;

    return (
      <div className={className || 'display-inline-block'}>
        <div className={`dropdown-container${clearCallback ? ' is-clearable' : ''}`}>
          <div className="clickable" onClick={this.showMenu}>
            {clickable}
          </div>

          {clearCallback && (
            <button className="hl-primary-btn-red" onClick={clearCallback}>
              <FontAwesomeIcon icon="times" />
            </button>
          )}
        </div>

        {menuOpen ? (
          <div
            className="dropdown-menu-container"
            ref={element => {
              this.dropdownMenu = element;
            }}
          >
            {menu}
          </div>
        ) : null}
      </div>
    );
  }
}

export default Dropdown;
