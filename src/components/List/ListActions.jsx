import React, { Component } from 'react';

class ListActions extends Component {
  render() {
    return (
      <div>
        <button className="hl-primary-btn no-background no-border"><i className="lilicon hl-edit-icon" /></button>
        <button className="hl-primary-btn no-background no-border m-l-10"><i className="lilicon hl-trashcan-icon" /></button>
      </div>
    );
  }
}

export default ListActions;
