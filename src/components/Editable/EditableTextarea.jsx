import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class EditableTextarea extends Component {
  constructor(props) {
    super(props);

    this.textareaRef = React.createRef();
  }

  componentDidMount() {
    this.setHeight();
  }

  setHeight = () => {
    // Set the height to 'auto' to properly calculate the scrollHeight.
    this.textareaRef.current.style.height = 'auto';
    this.textareaRef.current.style.height = `${this.textareaRef.current.scrollHeight}px`;
  };

  handleSubmit = () => {
    this.props.handleSubmit();
  };

  handleChange = event => {
    this.setHeight();

    this.props.handleChange(event.target.value);
  };

  render() {
    const { value } = this.props;

    return (
      <span className="editable-input-wrap editable-stretched">
        <textarea
          autoFocus
          value={value}
          onChange={this.handleChange}
          className="editable-input editable-has-buttons"
          ref={this.textareaRef}
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

export default EditableTextarea;
