import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Textarea from 'react-textarea-autosize';

class EditableTextarea extends Component {
  handleSubmit = () => {
    this.props.handleSubmit();
  };

  handleChange = event => {
    this.props.handleChange(event.target.value);
  };

  render() {
    const { value } = this.props;

    return (
      <span className="editable-input-wrap editable-stretched">
        <Textarea
          autoFocus
          value={value}
          onChange={this.handleChange}
          minRows={3}
          maxRows={15}
          className="editable-input editable-has-buttons"
        />

        <span className="editable-buttons">
          <button onClick={this.handleSubmit} type="submit">
            <FontAwesomeIcon icon="check" />
          </button>
          <button onClick={this.props.cancel} type="button">
            <FontAwesomeIcon icon="times" />
          </button>
        </span>
      </span>
    );
  }
}

export default EditableTextarea;
