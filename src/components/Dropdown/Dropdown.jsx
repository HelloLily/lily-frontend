import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false
    };
  }

  showMenu = event => {
    event.preventDefault();

    this.setState({ showMenu: true }, () => {
      document.addEventListener('click', this.closeMenu);
    });
  };

  closeMenu = event => {
    if (!this.dropdownMenu.contains(event.target)) {
      this.setState({ showMenu: false }, () => {
        document.removeEventListener('click', this.closeMenu);
      });
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="clickable" onClick={this.showMenu}>
          {this.props.clickable}
        </div>

        {this.state.showMenu ? (
          <div
            className="dropdown-menu-container"
            ref={element => {
              this.dropdownMenu = element;
            }}
          >
            {this.props.menu}
          </div>
        ) : null}
      </React.Fragment>
    );
  }
}

export default Dropdown;
