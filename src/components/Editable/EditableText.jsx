import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

class EditableText extends Component {
  constructor(props) {
    super(props);
  }

  handleSubmit = () => {
    const args = {
      id: this.props.object.id,
      [this.props.field]: this.props.value
    }

    this.props.handleSubmit(args);
  }

  handleChange = event => {
    event.preventDefault;

    this.props.handleChange(event.target.value);
  }

  render() {
    const { value } = this.props;

    return (
      <span className="editable-wrap">
        <input type="text" value={value} autoFocus onChange={this.handleChange} className="editable-has-buttons editable-input" />

        <span className="editable-buttons">
          <button onClick={this.handleSubmit}><FontAwesomeIcon icon="check" /></button>
          <button onClick={this.props.cancel}><FontAwesomeIcon icon="times" /></button>
        </span>
      </span>
    );
  }
}

export default EditableText;
