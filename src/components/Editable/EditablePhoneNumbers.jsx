import React, { Component } from 'react';
import Select from 'react-select';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import formatPhoneNumber from 'utils/formatPhoneNumber';

const phoneTypes = [
  { value: 'work', label: 'Work' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'home', label: 'Home' },
  { value: 'fax', label: 'Fax' },
  { value: 'other', label: 'Other' }
];

const emptyRow = { number: '', type: 'work' };

class EditablePhoneNumbers extends Component {
  componentDidMount = () => {
    if (this.props.value.length === 0) {
      this.props.addRow(emptyRow);
    }
  };

  onInputKeyDown = event => {
    if (event.keyCode === 27) {
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
    this.props.addRow(emptyRow);
  };

  handleSubmit = () => {
    const data = this.props.value.filter(item => item.number);

    this.props.handleSubmit(data);
  };

  formatPhoneNumber = index => {
    // TODO: Actual user should be used here.
    const user = { country: 'NL' };

    const items = this.props.value;

    // No need to format an empty value.
    if (items[index].number) {
      const address = this.props.object.addresses[0];
      const { formatted, isMobile } = formatPhoneNumber(items[index], user, address);

      if (formatted) {
        items[index].number = formatted;

        if (isMobile) {
          items[index].type = 'mobile';
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
                  options={phoneTypes}
                  value={{ value: item.type, label: item.type }}
                  onChange={selected => this.handleChange(selected.value, index, 'type')}
                  onInputKeyDown={this.onInputKeyDown}
                />
              </div>

              <button className="hl-primary-btn" onClick={() => this.toggleDelete(item, index)}>
                {item.isDeleted ? (
                  <FontAwesomeIcon icon="undo" />
                ) : (
                  <i className="lilicon hl-trashcan-icon" />
                )}
              </button>

              {hasError && <div className="error-message">{error[index].number}</div>}
            </div>
          );
        })}

        <span className="editable-buttons">
          <button onClick={this.addRow}>
            <FontAwesomeIcon icon="plus" />
          </button>
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

export default EditablePhoneNumbers;
