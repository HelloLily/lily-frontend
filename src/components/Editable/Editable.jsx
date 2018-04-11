import React, { Component } from 'react';

import EditableText from './EditableText';
import BlockUI from 'components/Utils/BlockUI';
import Account from 'src/models/Account';

class Editable extends Component {
  constructor(props) {
    super(props);

    this.editableRef = React.createRef();

    this.initialValue = this.props.object[this.props.field];

    this.state = {
      editing: false,
      value: this.initialValue,
      submitting: false
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = event => {
    // Cancel editing if we click outside the editable element.
    // This is to prevent accidental data saving.
    if (!this.state.submitting && this.editableRef.current && !this.editableRef.current.contains(event.target)) {
        this.cancel();
    }
  }

  handleKeyPress = event => {
    // Handle Enter key.
    if (event.keyCode === 13) {
      this.editableRef.current.handleSubmit();
    }

    // Handle ESC key.
    if (event.keyCode === 27) {
      this.cancel();
    }
  }

  enableEditing = () => {
    this.setState({ editing: true });
  }

  cancel = () => {
    this.setState({ value: this.initialValue, editing: false });
  }

  handleChange = value => {
    this.setState({ value });
  }

  handleSubmit = args => {
    this.setState({ submitting: true });

    const promise = Account.patch(args);

    promise.then(response => {
      this.initialValue = this.state.value;
      this.setState({ submitting: false, editing: false });
    });
  }

  render() {
    const { editing, value, submitting } = this.state;
    const { type } = this.props;

    const editableClassName = 'editable' + (!value ? ' editable-empty' : '');

    const props = {
      ...this.props,
      value,
      handleSubmit: this.handleSubmit,
      handleChange: this.handleChange,
      cancel: this.cancel,
      ref: this.editableRef
    }

    let component;

    if (type === 'text') {
      component = <EditableText {...props} />
    }

    return (
      <BlockUI blocking={submitting}>
        <span>
          {
            editing ?
              (
                <span onKeyDown={this.handleKeyPress}>
                  {component}
                </span>
              ) :
              (
                <span onClick={this.enableEditing} className={editableClassName}>
                  {value || 'No value'}
                </span>
              )
          }
        </span>
      </BlockUI>
    );
  }
}

export default Editable;
