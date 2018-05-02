import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';

import BlockUI from 'components/Utils/BlockUI';
import EditableText from './EditableText';
import EditableTextarea from './EditableTextarea';
import EditableAsyncSelect from './EditableAsyncSelect';
import EditableSelect from './EditableSelect';
import EditableIconSelect from './EditableIconSelect';

const components = {
  text: EditableText,
  textarea: EditableTextarea,
  select: EditableSelect
};

// We set up predefined parameters to reduce the amount of
// configuration options when calling Editable components.
const selectConfig = {
  assignedTo: {
    model: 'users',
    display: 'fullName',
    sorting: 'fullName',
    empty: 'Nobody'
  },
  assignedToTeams: {
    model: 'users/team',
    display: 'name',
    sorting: 'name'
  },
  type: {
    model: 'cases/types'
  },
  priority: {
    model: 'cases/priorities',
    choiceField: true,
    display: 'priorityDisplay',
    iconClass: 'lilicon hl-prio-icon-',
    iconDisplay: 'name'
  },
  nextStep: {
    model: 'deals/next-steps',
    iconClass: 'step-type position-',
    iconDisplay: 'position'
  }
};

class Editable extends Component {
  constructor(props) {
    super(props);

    const { field } = props;

    this.editableRef = React.createRef();

    let initialValue;

    if (selectConfig[field] && selectConfig[field].choiceField) {
      initialValue = { id: props.object[field], name: props.object[selectConfig[field].display] };
    } else {
      initialValue = props.object[field];
    }

    this.initialValue = initialValue;

    this.state = {
      editing: false,
      value: initialValue,
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

  handleKeyPress = event => {
    let shouldSubmit = event.keyCode === 13;

    if (this.props.type === 'textarea' || this.props.multi) {
      // Submit certain components with 'Meta' key (e.g. Ctrl) + 'Enter'.
      shouldSubmit = shouldSubmit && event.metaKey;
    }

    if (shouldSubmit) {
      // Handle Enter key.
      this.handleSubmit();
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
    this.setState({ value: this.initialValue, editing: false, error: null });
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
      args[field] = this.state.value.hasOwnProperty('id') ? this.state.value.id : this.state.value;
    } else {
      // Editable components might have some processing before submitting.
      // This means they'll pass the data instead of using this.state.value.
      args[field] = data;
    }

    if (multi) {
      args[field] = this.initialValue.map(value => {
        // Set the isDeleted flag if the value was removed.
        const isDeleted = args[field].some(item => item.id === value.id);

        return { id: value.id, isDeleted };
      });
    }

    // The Editable component is passed a function which does the actual submitting.
    const promise = this.props.submitCallback(args);

    this.setState({ submitting: true });

    let error = null;

    promise.then(() => {
      this.initialValue = this.state.value;
      this.setState({ editing: false });
    }).catch(errorResponse => {
      // Get the actual error message.
      error = errorResponse.data[field];
    }).finally(() => {
      // Always set the error. If there is none the current error will just get cleared.
      this.setState({ submitting: false, error });
    });
  }

  createOptions = items => {
    const config = selectConfig[this.props.field];

    let label = 'name';

    if (config && config.display && !config.choiceField) {
      label = config.display;
    }

    return items.map(item => ({ value: item, label: item[label] }));
  }

  createIconLabel = value => {
    const { iconClass, iconDisplay } = selectConfig[this.props.field];

    // Icon selects have a specific way of rendering.
    // That's the the className for the label's icon is always built the same way.
    return `${iconClass}${value[iconDisplay].toString().toLowerCase()}`;
  }

  render() {
    const { editing, value, submitting, error } = this.state;
    const { field, type } = this.props;
    const config = selectConfig[field];

    // Set up some generic props.
    const props = {
      ...this.props,
      value,
      handleSubmit: this.handleSubmit,
      handleChange: this.handleChange,
      cancel: this.cancel,
      selectConfig: config,
      error: this.state.error,
      createOptions: this.createOptions
    };

    // Dynamically set up the editable component.
    let EditableComponent;

    if (type === 'select' && (this.props.async || this.props.multi)) {
      EditableComponent = EditableAsyncSelect;
    } else if (type === 'select' && this.props.icon) {
      EditableComponent = EditableIconSelect;
      props.createIconLabel = this.createIconLabel;
    } else {
      EditableComponent = components[type];
    }

    let display;

    const hasValue = (typeof value !== 'undefined' && value !== null);

    if (this.props.multi && hasValue) {
      if (value.length > 0) {
        // Since there are multiple values there needs to be custom rendering.
        display = value.map(item => <div key={item.id}>{item.name}</div>);
      }
    } else if (hasValue && config) {
      // Certain fields have a custom field used as the displayed field.
      // If there is a custom endpoint, but no custom field just fall back to 'name'.
      display = value[config.display] || value.name;

      if (this.props.icon) {
        display = (
          <span>
            <i className={`${this.createIconLabel(value)} m-r-5`} />

            {!this.props.hideValue && display}
          </span>
        );
      }
    } else {
      // No special rendering, so display the value (or nothing).
      display = value;
    }

    // Certain fields have a custom empty state.
    const emptyText = (config && config.empty) ? config.empty : `No ${field}`;

    return (
      <BlockUI blocking={submitting}>
        <span onKeyDown={this.handleKeyPress} ref={this.editableRef}>
          {
            editing ?
              (
                <span className={`editable-wrap${error ? ' has-error' : ''}`}>
                  <EditableComponent {...props} />

                  {error && <div className="error-message">{error}</div>}
                </span>
              ) :
              (
                <span onClick={this.enableEditing} className={`editable${!display ? ' editable-empty' : ''}`}>
                  {
                    type === 'textarea' ?
                    (
                      <ReactMarkdown source={display || emptyText} />
                    ) :
                    (
                      <span>{display || emptyText}</span>
                    )
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
