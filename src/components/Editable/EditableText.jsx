import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import camelToHuman from 'utils/camelToHuman';

class EditableText extends Component {
  handleSubmit = () => {
    this.props.handleSubmit();
  };

  handleChange = event => {
    this.props.handleChange(event.target.value);
  };

  render() {
    const { value, field, cancel } = this.props;

    return (
      <span className="editable-input-wrap">
        <input
          autoFocus
          type="text"
          value={value}
          onChange={this.handleChange}
          className="editable-input editable-has-buttons"
          placeholder={camelToHuman(field, true)}
        />

        <span className="editable-buttons">
          <button onClick={this.handleSubmit}>
            <FontAwesomeIcon icon={['far', 'check']} />
          </button>
          <button onClick={cancel}>
            <FontAwesomeIcon icon={['far', 'times']} />
          </button>
        </span>
      </span>
    );
  }
}

export default EditableText;
