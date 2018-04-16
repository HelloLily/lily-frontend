import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

class EditableTextarea extends Component {
  constructor(props) {
    super(props);

    this.textareaRef = React.createRef();
  }

  componentDidMount() {
    this.setHeight();
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

    this.setHeight();

    this.props.handleChange(event.target.value);
  }

  setHeight = () => {
    // Set the height to 'auto' to properly calculate the scrollHeight.
    this.textareaRef.current.style.height = 'auto';
    this.textareaRef.current.style.height = `${this.textareaRef.current.scrollHeight}px`;
  }

  render() {
    const { value } = this.props;

    return (
      <span className="editable-wrap editable-textarea">
        <textarea value={value} autoFocus onChange={this.handleChange} className="editable-has-buttons editable-input" ref={this.textareaRef} />

        <span className="editable-buttons">
          <button onClick={this.handleSubmit}><FontAwesomeIcon icon="check" /></button>
          <button onClick={this.props.cancel}><FontAwesomeIcon icon="times" /></button>
        </span>
      </span>
    );
  }
}

export default EditableTextarea;
