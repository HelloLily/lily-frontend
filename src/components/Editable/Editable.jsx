import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import BlockUI from 'components/Utils/BlockUI';
import Address from 'components/Utils/Address';
import EditableText from './EditableText';
import EditableTextarea from './EditableTextarea';
import EditableAsyncSelect from './EditableAsyncSelect';
import EditableSelect from './EditableSelect';
import EditableIconSelect from './EditableIconSelect';
import EditableEmailAddresses from './EditableEmailAddresses';
import EditablePhoneNumbers from './EditablePhoneNumbers';
import EditableAddresses from './EditableAddresses';
import EditableWebsites from './EditableWebsites';
import EditableTags from './EditableTags';

const components = {
  text: EditableText,
  textarea: EditableTextarea,
  select: EditableSelect,
  emailAddresses: EditableEmailAddresses,
  phoneNumbers: EditablePhoneNumbers,
  addresses: EditableAddresses,
  websites: EditableWebsites,
  tags: EditableTags
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

// General styling overwrite for Editable selects.
const selectStyles = {
  control: base => ({
    ...base,
    background: '#fff',
    minHeight: '28px',
    height: '30px'
  }),
  valueContainer: base => ({
    ...base,
    padding: '0 8px'
  }),
  input: base => ({
    ...base,
    paddingTop: '0',
    paddingBottom: '0',
    margin: '0 2px'
  }),
  dropdownIndicator: base => ({
    ...base,
    padding: '4px'
  }),
  option: base => ({
    ...base,
    padding: '2px 12px'
  }),
  menuList: base => ({
    ...base,
    paddingTop: '0',
    paddingBottom: '0'
  }),
  multiValueLabel: base => ({
    ...base,
    lineHeight: '24px',
    padding: '0 4px'
  })
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

    this.state = {
      editing: false,
      value: initialValue,
      submitting: false,
      initialValue
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
  };

  enableEditing = event => {
    const selection = window.getSelection().toString();
    const elementName = event.target.localName;

    // Allow users to select the field without opening the edit form.
    // Also prevent the input from showing if we're clicking a link.
    if (!selection && elementName !== 'a') {
      this.setState({ editing: true });
    }
  };

  cancel = () => {
    this.setState({ value: this.state.initialValue, editing: false, error: null });
  };

  handleChange = (value = '') => {
    console.log(value);
    this.setState({ value });
  };

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
      args[field] = this.state.initialValue.map(value => {
        // Set the isDeleted flag if the value was removed.
        const isDeleted = args[field].some(item => item.id === value.id);

        return { id: value.id, isDeleted };
      });
    }

    // The Editable component is passed a function which does the actual submitting.
    const promise = this.props.submitCallback(args);

    this.setState({ submitting: true });

    let error = null;

    promise
      .then(() => {
        this.setState({ initialValue: this.state.value, editing: false });
      })
      .catch(errorResponse => {
        // Get the actual error message.
        error = errorResponse.data[field];
      })
      .finally(() => {
        // Always set the error. If there is none the current error will just get cleared.
        this.setState({ submitting: false, error });
      });
  };

  createOptions = items => {
    const config = selectConfig[this.props.field];

    let label = 'name';

    if (config && config.display && !config.choiceField) {
      label = config.display;
    }

    return items.map(item => ({ value: item, label: item[label] }));
  };

  createIconLabel = value => {
    const { iconClass, iconDisplay } = selectConfig[this.props.field];

    // Icon selects have a specific way of rendering.
    // That's the the className for the label's icon is always built the same way.
    return `${iconClass}${value[iconDisplay].toString().toLowerCase()}`;
  };

  addRow = data => {
    // Adds a row to the related field.
    this.setState({ value: [...this.state.value, Object.assign({}, data)] });
  };

  render() {
    const { editing, submitting, error } = this.state;
    const { field, type, multi } = this.props;
    const config = selectConfig[field];

    let { value } = this.state;

    const hasValue = typeof value !== 'undefined' && value !== null;

    if (!hasValue) {
      value = '';
    }

    if (Array.isArray(value)) {
      // Deep copy the array of objects.
      value = value.map(item => ({ ...item }));
    }

    // Set up some generic props.
    const props = {
      ...this.props,
      value,
      selectConfig: config,
      handleSubmit: this.handleSubmit,
      handleChange: this.handleChange,
      cancel: this.cancel,
      error: this.state.error,
      createOptions: this.createOptions
    };

    // Dynamically set up the editable component.
    let EditableComponent;

    if (type === 'select' && (this.props.async || multi)) {
      EditableComponent = EditableAsyncSelect;
    } else if (type === 'select' && this.props.icon) {
      EditableComponent = EditableIconSelect;
      props.createIconLabel = this.createIconLabel;
    } else if (type === 'related') {
      props.addRow = this.addRow;
      EditableComponent = components[field];
    } else {
      EditableComponent = components[type];
    }

    if (type === 'select' || type === 'related' || type === 'tags') {
      props.selectStyles = selectStyles;
    }

    let display;

    if (multi && hasValue) {
      if (value.length > 0) {
        // Since there are multiple values there needs to be custom rendering.
        display = value.map(item => <div key={item.id}>{item.name}</div>);
      }
    } else if (type === 'related' && hasValue) {
      if (value.length > 0) {
        // Since there are multiple values there needs to be custom rendering.
        display = value.map(item => {
          let row;

          switch (field) {
            case 'emailAddresses':
              row = (
                <NavLink to={`/email/compose/${item.emailAddress}`}>{item.emailAddress}</NavLink>
              );
              break;
            case 'phoneNumbers':
              row = <a href={`tel:${item.number}`}>{item.number}</a>;
              break;
            case 'addresses':
              row = <Address address={item} />;
              break;
            case 'websites':
              row = <a href={`${item.website}`}>{item.website.replace(/http(s)?:\/\//, '')}</a>;
              break;
            default:
              return null;
          }

          return <div key={item.id}>{row}</div>;
        });
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
    const emptyText = config && config.empty ? config.empty : `No ${field}`;

    const hasError = error && type !== 'related';

    return (
      <BlockUI blocking={submitting}>
        <span onKeyDown={this.handleKeyPress} ref={this.editableRef}>
          {editing ? (
            <span className={`editable-wrap${hasError ? ' has-error' : ''}`}>
              <EditableComponent {...props} />

              {hasError && <div className="error-message">{error}</div>}
            </span>
          ) : (
            <span
              onClick={this.enableEditing}
              className={`editable${!display ? ' editable-empty' : ''}`}
            >
              {type === 'textarea' ? (
                <ReactMarkdown source={display || emptyText} />
              ) : (
                <span>{display || emptyText}</span>
              )}
            </span>
          )}
        </span>
      </BlockUI>
    );
  }
}

export default Editable;
