import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class ColumnDisplay extends Component {
  render() {
    return (
      <div className={this.props.className || ''}>
        <button className="hl-primary-btn">
          <FontAwesomeIcon icon="columns" />
          <span className="m-l-5 m-r-5">Columns</span>
          <i className="lilicon hl-toggle-down-icon small" />
        </button>
      </div>
    );
  }
}

export default ColumnDisplay;
