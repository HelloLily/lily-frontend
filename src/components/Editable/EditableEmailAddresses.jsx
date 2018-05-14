import React, { Component } from 'react';
import Select from 'react-select';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import { INACTIVE_EMAIL_STATUS, OTHER_EMAIL_STATUS, PRIMARY_EMAIL_STATUS } from 'lib/constants';

const emailStatuses = ['Inactive', 'Other', 'Primary'];

const statusOptions = emailStatuses
  .map((status, index) => ({ value: index, label: status }))
  .reverse();

const emptyRow = { emailAddress: '', status: OTHER_EMAIL_STATUS };

class EditableEmailAddresses extends Component {
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

    if (field === 'status' && value === PRIMARY_EMAIL_STATUS) {
      items.forEach(item => {
        if (item !== items[index] && item.status !== INACTIVE_EMAIL_STATUS) {
          item.status = OTHER_EMAIL_STATUS;
        }
      });
    }

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
    const data = this.props.value.filter(item => item.emailAddress);

    this.props.handleSubmit(data);
  };

  render() {
    const { value, selectStyles, error } = this.props;

    return (
      <span className="editable-input-wrap editable-stretched">
        {value.map((item, index) => {
          const hasError = error && error[index] && error[index].emailAddress;
          const rowClassName = cx('editable-related-row', {
            'is-deleted': item.isDeleted,
            'has-error': hasError
          });

          return (
            <div className={rowClassName} key={item.id || `row-${index}`}>
              <input
                autoFocus
                type="text"
                value={item.emailAddress}
                onChange={event => this.handleChange(event.target.value, index, 'emailAddress')}
                className="editable-input"
                placeholder="Email address"
              />

              <div className="w-30 m-l-10 m-r-10">
                <Select
                  name="status"
                  styles={selectStyles}
                  options={statusOptions}
                  value={{ label: emailStatuses[item.status], value: item.status }}
                  onChange={selected => this.handleChange(selected.value, index, 'status')}
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

              {error &&
                error[index].emailAddress && (
                  <div className="error-message">{error[index].emailAddress}</div>
                )}
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

export default EditableEmailAddresses;
