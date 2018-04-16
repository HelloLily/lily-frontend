import React, { Component } from 'react';

import EditableText from './EditableText';
import EditableTextarea from './EditableTextarea';
import EditableSelect from './EditableSelect';
import EditableMultiSelect from './EditableMultiSelect';
import BlockUI from 'components/Utils/BlockUI';
import Account from 'src/models/Account';

const components = {
  text: EditableText,
  textarea: EditableTextarea,
  select: EditableSelect,
  multiSelect: EditableMultiSelect
}

const searchMapping = {
  assignedTo: {
    model: 'users',
    display: 'fullName',
    sorting: 'fullName'
  }
}

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
    if (!this.state.submitting && this.editableRef.current !== null && !this.editableRef.current.contains(event.target)) {
      this.cancel();
    }
  }

  handleKeyPress = event => {
    if (this.props.type !== 'textarea') {
      // Handle Enter key.
      if (event.keyCode === 13) {
        this.editableRef.current.handleSubmit();
      }
    }

    // Handle ESC key.
    if (event.keyCode === 27) {
      this.cancel();
    }
  }

  enableEditing = event => {
    const selection = window.getSelection().toString();
    const elementName = event.target.localName;

    // Allow users to select the field without opening the edit form.
    // Also prevent the input from showing if we're clicking a link.
    if (!selection && elementName !== 'a') {
      this.setState({ editing: true });
    }
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
    const { field, type } = this.props;

    const editableClassName = 'editable' + (!value ? ' editable-empty' : '');

    const props = {
      ...this.props,
      value,
      handleSubmit: this.handleSubmit,
      handleChange: this.handleChange,
      cancel: this.cancel,
      searchMapping: searchMapping[this.props.field]
    }

    const EditableComponent = components[type];

    const display = (value && searchMapping[field]) ? value[searchMapping[field].display] : value;

    return (
      <BlockUI blocking={submitting}>
        <span onKeyDown={this.handleKeyPress} ref={this.editableRef}>
          {
            editing ?
              (
                <span>
                  <EditableComponent {...props} />
                </span>
              ) :
              (
                <span onClick={this.enableEditing} className={editableClassName}>
                  {display || 'No value'}
                </span>
              )
          }
        </span>
      </BlockUI>
    );
  }
}

export default Editable;
