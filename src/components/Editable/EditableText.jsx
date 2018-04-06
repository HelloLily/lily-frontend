import React, { Component } from 'react';

class EditableText extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false
    }
  }

  render() {
    return (
      <span onClick={() => this.setState(editing: true)}>

      </span>
    );
  }
}

export default EditableText;
