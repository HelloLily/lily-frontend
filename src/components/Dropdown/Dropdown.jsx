import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ESCAPE_KEY } from 'lib/constants';

class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuOpen: false
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleEvent);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleEvent);
  }

  showMenu = event => {
    event.preventDefault();

    this.setState({ menuOpen: true }, () => {
      document.addEventListener('click', this.handleEvent);
    });
  };

  closeMenu = () => {
    this.setState({ menuOpen: false }, () => {
      document.removeEventListener('click', this.handleEvent);
    });
  };

  handleEvent = event => {
    const closeMenu =
      event.keyCode === ESCAPE_KEY ||
      (this.dropdownMenu && !event.keyCode && !this.dropdownMenu.contains(event.target));

    if (closeMenu) {
      this.closeMenu();
    }
  };

  handleClick = () => {
    if (this.props.closeOnClick) {
      this.setState({ menuOpen: false });
    }
  };

  render() {
    const { menuOpen } = this.state;
    const { clickable, menu, clearCallback, className } = this.props;

    return (
      <div className={className || 'display-inline-block'}>
        <div className={`dropdown-container${clearCallback ? ' is-clearable' : ''}`}>
          <div className="clickable" onClick={this.showMenu} role="button" tabIndex={0}>
            {clickable}
          </div>

          {clearCallback && (
            <button className="hl-primary-btn-red" onClick={clearCallback}>
              <FontAwesomeIcon icon={['far', 'times']} />
            </button>
          )}
        </div>

        {menuOpen ? (
          <div
            className="dropdown-menu-container"
            role="button"
            tabIndex={0}
            onClick={this.handleClick}
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
