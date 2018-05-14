import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

class EditableText extends Component {
  handleSubmit = () => {
    this.props.handleSubmit();
  };

  handleChange = event => {
    this.props.handleChange(event.target.value);
  };

  render() {
    const { value } = this.props;

    return (
      <span className="editable-input-wrap">
        <input
          autoFocus
          type="text"
          value={value}
          onChange={this.handleChange}
          className="editable-has-buttons editable-input"
          placeholder={this.props.field}
        />

        <span className="editable-buttons">
          <button onClick={this.handleSubmit}>
            <FontAwesomeIcon icon="check" />
          </button>
          <button onClick={this.props.cancel}>
            <FontAwesomeIcon icon="times" />
          </button>
        </span>
      </span>
    );
  }
}

export default EditableText;
