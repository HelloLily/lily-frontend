import React, { Component } from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import withContext from 'src/withContext';
import formatPhoneNumber from 'utils/formatPhoneNumber';
import { MOBILE_PHONE_TYPE, PHONE_TYPE_OPTIONS, PHONE_EMPTY_ROW, ESCAPE_KEY } from 'lib/constants';

class EditablePhoneNumbers extends Component {
  componentDidMount = () => {
    if (this.props.value.length === 0) {
      this.props.addRow(PHONE_EMPTY_ROW);
    }
  };

  onInputKeyDown = event => {
    if (event.keyCode === ESCAPE_KEY) {
      // Don't blur when Esc is pressed, but cancel the editing.
      event.preventDefault();
    }
  };

  handleChange = (value, index, field) => {
    const items = this.props.value;
    items[index][field] = value;

    this.props.handleChange(items);
  };

  toggleDelete = (item, index) => {
    this.handleChange(!item.isDeleted, index, 'isDeleted');
  };

  addRow = () => {
    this.props.addRow(PHONE_EMPTY_ROW);
  };

  handleSubmit = () => {
    const data = this.props.value.map(item => {
      if (!item.number) {
        item.isDeleted = true;
      }

      return item;
    });

    const args = {
      id: this.props.object.id,
      [this.props.field]: data
    };

    this.props.handleSubmit(args);
  };

  formatPhoneNumber = index => {
    const items = this.props.value;

    // No need to format an empty value.
    if (items[index].number) {
      const address = this.props.object.addresses[0];
      const { formatted, isMobile } = formatPhoneNumber(
        items[index].number,
        this.props.currentUser,
        address
      );

      if (formatted) {
        items[index].number = formatted;

        if (isMobile) {
          items[index].type = MOBILE_PHONE_TYPE;
        }
      }

      this.props.handleChange(items);
    }
  };

  render() {
    const { value, selectStyles, error } = this.props;

    return (
      <span className="editable-input-wrap editable-stretched">
        {value.map((item, index) => {
          const hasError = error && error[index] && error[index].number;
          const rowClassName = cx('editable-related-row', {
            'is-deleted': item.isDeleted,
            'has-error': hasError
          });

          return (
            <div className={rowClassName} key={item.id || `row-${index}`}>
              <input
                autoFocus
                type="text"
                value={item.number}
                onChange={event => this.handleChange(event.target.value, index, 'number')}
                className="editable-input"
                onBlur={() => this.formatPhoneNumber(index)}
                placeholder="Phone number"
              />

              <div className="w-30 m-l-10 m-r-10">
                <Select
                  name="type"
                  className="text-capitalize"
                  styles={selectStyles}
                  options={PHONE_TYPE_OPTIONS}
                  value={{ value: item.type, label: item.type }}
                  onChange={selected => this.handleChange(selected.value, index, 'type')}
                  onInputKeyDown={this.onInputKeyDown}
                  menuPortalTarget={document.body}
                />
              </div>

              <button className="hl-primary-btn" onClick={() => this.toggleDelete(item, index)}>
                {item.isDeleted ? (
                  <FontAwesomeIcon icon={['far', 'undo']} />
                ) : (
                  <FontAwesomeIcon icon={['far', 'trash-alt']} />
                )}
              </button>

              {hasError && <div className="error-message">{error[index].number}</div>}
            </div>
          );
        })}

        <span className="editable-buttons">
          <button onClick={this.addRow}>
            <FontAwesomeIcon icon={['far', 'plus']} />
          </button>
          <button onClick={this.handleSubmit}>
            <FontAwesomeIcon icon={['far', 'check']} />
          </button>
          <button onClick={this.props.cancel}>
            <FontAwesomeIcon icon={['far', 'times']} />
          </button>
        </span>
      </span>
    );
  }
}

export default withContext(EditablePhoneNumbers);
