import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { SELECT_STYLES, ESCAPE_KEY } from 'lib/constants';
import BlockUI from 'components/Utils/BlockUI';
import Address from 'components/Utils/Address';
import SocialMediaIcon from 'components/Utils/SocialMediaIcon';
import PriorityIcon from 'components/Utils/PriorityIcon';
import EmailLink from 'components/Utils/EmailLink';
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
const EditableSocialMedia = React.lazy(() => import('./EditableSocialMedia'));
const EditableTags = React.lazy(() => import('./EditableTags'));

const components = {
  text: EditableText,
  textarea: EditableTextarea,
  select: EditableSelect,
  emailAddresses: EditableEmailAddresses,
  phoneNumbers: EditablePhoneNumbers,
  addresses: EditableAddresses,
  websites: EditableWebsites,
  socialMedia: EditableSocialMedia,
  tags: EditableTags
};

class Editable extends Component {
  constructor(props) {
    super(props);

    const { field } = props;

    this.mounted = false;
    this.editableRef = React.createRef();

    const selectConfig = getSelectConfig(field);

    this.selectConfig = selectConfig;

    const initialValue = this.getInitialValue();

    this.state = {
      editing: false,
      value: initialValue,
      submitting: false,
      initialValue
    };
  }

  async componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  getInitialValue = () => {
    const { object, field } = this.props;

    if (this.selectConfig && this.selectConfig.choiceField) {
      return { id: object[field], name: object[this.selectConfig.display] };
    }

    return object[field];
  };

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
    const { multi, field, type, object, submitCallback } = this.props;

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

    if (type === 'related' || type === 'tags') {
      args[field] = args[field].filter(item => item.id || (!item.id && !item.isDeleted));

      // Filter out any deleted values so we clean our new values.
      newValue = args[field].filter(item => !item.isDeleted);
    }

    const promise = submitCallback ? submitCallback(args) : updateModel(object, args);

    this.setState({ submitting: true });

    let error = null;

    promise
      .then(response => {
        if (response && submitCallback) {
          newValue = response[field];
        }

        if (this.mounted) {
          this.setState({ value: newValue, initialValue: newValue, editing: false });
        }
      })
      .catch(errorResponse => {
        // Get the actual error message.
        error = errorResponse.data[field];
      })
      .finally(() => {
        if (this.mounted) {
          // Always set the error. If there is none the current error will just get cleared.
          this.setState({ submitting: false, error });
        }
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

  createIcon = value => {
    const { field } = this.props;

    const { iconDisplay } = this.selectConfig;

    let icon;

    if (field === 'priority') {
      icon = <PriorityIcon priority={value} />;
    } else if (field === 'nextStep') {
      const position = value[iconDisplay].toString().toLowerCase();
      icon = <i className={`step-type position-${position}} m-r-5`} />;
    }

    return icon;
  };

  addRow = data => {
    const { value } = this.state;
    // Adds a row to the related field.
    this.setState({ value: [...value, Object.assign({}, data)] });
  };

  getDisplay = (value, hasValue) => {
    const { object, field, type, multi } = this.props;
    const config = Object.assign({}, this.selectConfig);

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
                row = (
                  <EmailLink state={{ emailAddress: item.emailAddress }}>
                    {item.emailAddress}
                  </EmailLink>
                );
                break;
              case 'phoneNumbers':
                row = <a href={`tel:${item.number}`}>{item.number}</a>;
                break;
              case 'addresses':
                row = <Address address={item} />;
                break;
              case 'socialMedia':
                row = (
                  <div>
                    <SocialMediaIcon item={item} />

                    <a
                      href={item.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="m-l-5"
                    >
                      {item.username}
                    </a>
                  </div>
                );
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
              {this.createIcon(value)}

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

    return display;
  };

  render() {
    const { editing, submitting, error } = this.state;
    const { object, field, type, multi } = this.props;
    const config = Object.assign({}, this.selectConfig);

    if (field === 'status') {
      // We need to manually apply the content type since there are multiple status endpoints.
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
      props.createIcon = this.createIcon;
    } else if (type === 'related') {
      EditableComponent = components[field];
      props.addRow = this.addRow;
    } else {
      EditableComponent = components[type];
    }

    if (type === 'select' || type === 'related' || type === 'tags') {
      props.selectStyles = SELECT_STYLES;
    }

    const display = this.getDisplay(value, hasValue);
    // Certain fields have a custom empty state.
    const emptyText = this.getEmptyText();
    const hasError = error && type !== 'related';

    return (
      <BlockUI blocking={submitting}>
        <span
          role="presentation"
          className={this.props.inlineBlock ? 'display-inline-block' : ''}
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
            <div
              role="presentation"
              onClick={this.enableEditing}
              className={`editable${!display ? ' editable-empty' : ''}`}
            >
              <div className="editable-content">
                {type === 'textarea' ? (
                  <ReactMarkdown source={display || emptyText} />
                ) : (
                  <span>{display || emptyText}</span>
                )}
              </div>

              <button className="editable-open hl-primary-btn borderless">
                <FontAwesomeIcon icon={['far', 'pencil-alt']} />
              </button>
            </div>
          )}
        </span>
      </BlockUI>
    );
  }
}

export default Editable;
