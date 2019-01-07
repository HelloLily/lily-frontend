import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import { SELECT_STYLES, ESCAPE_KEY } from 'lib/constants';
import BlockUI from 'components/Utils/BlockUI';
import Address from 'components/Utils/Address';
import LilyTooltip from 'components/LilyTooltip';
import camelToHuman from 'utils/camelToHuman';
import updateModel from 'utils/updateModel';
import getSelectConfig from './getSelectConfig';

const EditableText = React.lazy(() => import('./EditableText'));
const EditableTextarea = React.lazy(() => import('./EditableTextarea'));
const EditableAsyncSelect = React.lazy(() => import('./EditableAsyncSelect'));
const EditableSelect = React.lazy(() => import('./EditableSelect'));
const EditableIconSelect = React.lazy(() => import('./EditableIconSelect'));
const EditableEmailAddresses = React.lazy(() => import('./EditableEmailAddresses'));
const EditablePhoneNumbers = React.lazy(() => import('./EditablePhoneNumbers'));
const EditableAddresses = React.lazy(() => import('./EditableAddresses'));
const EditableWebsites = React.lazy(() => import('./EditableWebsites'));
const EditableTags = React.lazy(() => import('./EditableTags'));

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

class Editable extends Component {
  constructor(props) {
    super(props);

    const { field } = props;

    this.editableRef = React.createRef();

    let initialValue;

    const selectConfig = getSelectConfig(field);

    this.selectConfig = selectConfig;

    if (selectConfig && selectConfig.choiceField) {
      initialValue = { id: props.object[field], name: props.object[selectConfig.display] };
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

  getEmptyText = () => {
    const { field } = this.props;
    const config = this.selectConfig;

    let emptyText = '';

    if (config && config.empty) {
      emptyText = config.empty;
    } else {
      emptyText = `No ${camelToHuman(field)}`;
    }

    return emptyText;
  };

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
    if (event.keyCode === ESCAPE_KEY) {
      this.cancel();
    }
  };

  enableEditing = event => {
    const selection = window.getSelection().toString();
    const elementName = event.target.type;

    // Allow users to select the field without opening the edit form.
    // Also prevent the input from showing if we're clicking a link.
    if (!selection && elementName !== 'a') {
      this.setState({ editing: true });
    }
  };

  cancel = () => {
    const { initialValue } = this.state;

    this.setState({ value: initialValue, editing: false, error: null });
  };

  handleChange = (value = '') => {
    this.setState({ value });
  };

  handleSubmit = (data = null) => {
    const { value, initialValue } = this.state;
    const { multi, field, type, object } = this.props;

    let args = {
      id: object.id
    };

    if (!data) {
      args[field] = value.hasOwnProperty('id') ? value.id : value;
    } else {
      // Editable components might have some processing before submitting.
      // This means they'll pass the data instead of using this.state.value.
      args = data;
    }

    if (multi) {
      initialValue.forEach(val => {
        const isDeleted = !args[field].some(item => item.id && item.id === val.id);

        if (isDeleted) {
          args[field].push({ id: val.id, isDeleted });
        }
      });
    }

    let newValue = value;

    if (type === 'related') {
      args[field] = value.filter(item => item.id || (!item.id && !item.isDeleted));

      // Filter out any deleted values so we clean our new values.
      newValue = args[field].filter(item => !item.isDeleted);
    }

    const promise = this.props.hasOwnProperty('submitCallback')
      ? this.props.submitCallback(args)
      : updateModel(object, args);

    this.setState({ submitting: true });

    let error = null;

    promise
      .then(() => {
        this.setState({ value: newValue, initialValue: newValue, editing: false });
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
    const config = this.selectConfig;

    let label = 'name';

    if (config && config.display && !config.choiceField) {
      label = config.display;
    }

    return items.map(item => ({ value: item, label: item[label] }));
  };

  createIconLabel = value => {
    const { iconClass, iconDisplay } = this.selectConfig;

    // Icon selects have a specific way of rendering.
    // That's the the className for the label's icon is always built the same way.
    return `${iconClass}${value[iconDisplay].toString().toLowerCase()}`;
  };

  addRow = data => {
    const { value } = this.state;
    // Adds a row to the related field.
    this.setState({ value: [...value, Object.assign({}, data)] });
  };

  render() {
    const { editing, submitting, error } = this.state;
    const { object, field, type, multi } = this.props;
    const config = Object.assign({}, this.selectConfig);

    if (field === 'status') {
      config.model = `${object.contentType.appLabel}${config.model}`;
    }

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
      error,
      selectConfig: config,
      handleSubmit: this.handleSubmit,
      handleChange: this.handleChange,
      cancel: this.cancel,
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
      props.selectStyles = SELECT_STYLES;
    }

    let display;

    if (!this.props.children) {
      if (multi && hasValue) {
        if (value.length > 0) {
          // Since there are multiple values there needs to be custom rendering.
          display = value.map(item => <div key={item.id}>{item.name}</div>);
        }
      } else if (type === 'related' && hasValue) {
        if (value.length > 0) {
          // Since there are multiple values there needs to be custom rendering.
          display = value.map((item, index) => {
            let row;

            switch (field) {
              case 'emailAddresses':
                row = <Link to={`/email/compose/${item.emailAddress}`}>{item.emailAddress}</Link>;
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

            // New rows don't have an ID, so create a key based on current index.
            return <div key={item.id || `row-${index}`}>{row}</div>;
          });
        }
      } else if (hasValue && Object.keys(config).length) {
        // Certain fields have a custom field used as the displayed field.
        // If there is a custom endpoint, but no custom field just fall back to 'name'.
        display = value[config.display] || value.name;

        if (this.props.icon) {
          const tooltip = this.props.hideValue ? display : '';
          const tooltipId = `icon-${object.id}-${field}`;

          display = (
            <span data-tip={tooltip} data-for={tooltipId}>
              <i className={`${this.createIconLabel(value)} m-r-5`} />

              {/* Add a tooltip if the value isn't shown */}
              {!this.props.hideValue ? display : <LilyTooltip id={tooltipId} />}
            </span>
          );
        }
      } else {
        // No special rendering, so display the value (or nothing).
        display = value;
      }
    } else {
      display = this.props.children;
    }

    // Certain fields have a custom empty state.
    const emptyText = this.getEmptyText();
    const hasError = error && type !== 'related';

    return (
      <BlockUI blocking={submitting}>
        <span
          role="presentation"
          className="display-inline-block"
          onKeyDown={this.handleKeyPress}
          ref={this.editableRef}
        >
          {editing ? (
            <span className={`editable-wrap${hasError ? ' has-error' : ''}`}>
              <React.Suspense fallback={<span>{display || emptyText}</span>}>
                <EditableComponent {...props} />
              </React.Suspense>

              {hasError && <div className="error-message">{error}</div>}
            </span>
          ) : (
            <span
              role="presentation"
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
