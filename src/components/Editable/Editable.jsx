import React, { Component } from 'react';

import BlockUI from 'components/Utils/BlockUI';
import EditableText from './EditableText';
import EditableTextarea from './EditableTextarea';
import EditableSelect from './EditableSelect';

const components = {
  text: EditableText,
  textarea: EditableTextarea,
  select: EditableSelect
};

// We set up predefined parameters to reduce the amount of
// configuration options when calling editable components.
const searchMapping = {
  assignedTo: {
    model: 'users',
    display: 'fullName',
    sorting: 'fullName'
  },
  assignedToTeams: {
    model: 'users/team',
    display: 'name',
    sorting: 'name'
  }
};

class Editable extends Component {
  constructor(props) {
    super(props);

    this.editableRef = React.createRef();

    this.initialValue = this.props.object[this.props.field];

    this.state = {
      editing: false,
      value: this.initialValue,
      submitting: false
    };
  }

  componentDidMount() {
    if (!this.props.multi) {
      document.addEventListener('mousedown', this.handleClickOutside);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = event => {
    const editableRef = this.editableRef.current;

    // Cancel editing if we click outside the editable element.
    // This is to prevent accidental data saving.
    if (!this.state.submitting && editableRef !== null && !editableRef.contains(event.target)) {
      this.cancel();
    }
  }

  handleKeyPress = event => {
    if (this.props.type !== 'textarea' && !this.props.multi) {
      // Handle Enter key.
      if (event.keyCode === 13) {
        this.handleSubmit();
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

  handleSubmit = (data = null) => {
    const { multi, field } = this.props;

    const args = {
      id: this.props.object.id
    };

    if (!data) {
      args[field] = this.state.value;
    } else {
      args[field] = data;
    }

    if (multi) {
      args[field] = this.initialValue.map(value => {
        const isDeleted = args[field].some(item => item.id === value.id);

        return { id: value.id, isDeleted };
      });
    }

    const promise = this.props.submitCallback(args);

    this.setState({ submitting: true });

    promise.then(() => {
      this.initialValue = this.state.value;
      this.setState({ editing: false });
    }).catch(error => {
      this.setState({ error: error.data[field] });
    }).finally(() => {
      this.setState({ submitting: false });
    });
  }

  render() {
    const { editing, value, submitting } = this.state;
    const { field, type } = this.props;

    const props = {
      ...this.props,
      value,
      handleSubmit: this.handleSubmit,
      handleChange: this.handleChange,
      cancel: this.cancel,
      searchMapping: searchMapping[field],
      error: this.state.error
    };

    // Dynamically set up the editable component.
    const EditableComponent = components[type];

    let display;

    if (this.props.multi) {
      if (value.length > 0) {
        display = value.map(item => <div key={item.id}>{item.name}</div>);
      }
    } else if (value && searchMapping[field]) {
      display = value[searchMapping[field].display];
    } else {
      display = value;
    }

    const editableClassName = `editable${!display ? ' editable-empty' : ''}`;

    return (
      <BlockUI blocking={submitting}>
        <span onKeyDown={this.handleKeyPress} ref={this.editableRef}>
          {
            editing ?
              (
                <span className={this.state.error ? 'has-error' : ''}>
                  <EditableComponent {...props} />
                </span>
              ) :
              (
                <span onClick={this.enableEditing} className={editableClassName}>
                  {
                    <span>{display || `No ${field}`}</span>
                  }
                </span>
              )
          }
        </span>
      </BlockUI>
    );
  }
}

export default Editable;
