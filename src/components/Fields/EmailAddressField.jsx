import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import Select from 'react-select';

import {
  INACTIVE_EMAIL_STATUS,
  OTHER_EMAIL_STATUS,
  PRIMARY_EMAIL_STATUS,
  EMAIL_STATUSES,
  EMAIL_STATUS_OPTIONS,
  EMAIL_EMPTY_ROW,
  SELECT_STYLES
} from 'lib/constants';

class EmailAddressField extends Component {
  componentDidMount() {
    if (this.props.items.length === 0) {
      const primaryRow = { emailAddress: '', status: PRIMARY_EMAIL_STATUS };
      this.handleRelated([primaryRow]);
    }
  }

  handleChange = (value, index, field) => {
    const { items } = this.props;

    if (field === 'status' && value === PRIMARY_EMAIL_STATUS) {
      items.forEach(item => {
        if (item !== items[index] && item.status !== INACTIVE_EMAIL_STATUS) {
          item.status = OTHER_EMAIL_STATUS;
        }
      });
    }

    items[index][field] = value;

    this.handleRelated(items);
  };

  handleRelated = items => {
    this.props.handleRelated('emailAddresses', items);
  };

  addRow = () => {
    const { items } = this.props;
    const newRow = Object.assign({}, EMAIL_EMPTY_ROW);

    this.handleRelated([...items, newRow]);
  };

  toggleDelete = (item, index) => {
    this.handleChange(!item.isDeleted, index, 'isDeleted');
  };

  render() {
    const { items, inline } = this.props;

    return (
      <React.Fragment>
        {items.map((item, index) => {
          // const hasError = error && error[index] && error[index].emailAddress;
          const rowClassName = cx('editable-related-row', {
            'is-deleted': item.isDeleted
            // 'has-error': hasError
          });

          return (
            <div className={rowClassName} key={item.id || `row-${index}`}>
              <input
                autoFocus={inline}
                type="text"
                value={item.emailAddress}
                onChange={event => this.handleChange(event.target.value, index, 'emailAddress')}
                className="editable-input"
                placeholder="Email address"
                onBlur={() => this.props.onInputBlur(item.emailAddress)}
              />

              <div className="w-30 m-l-10 m-r-10">
                <Select
                  name="status"
                  styles={SELECT_STYLES}
                  options={EMAIL_STATUS_OPTIONS}
                  value={{ label: EMAIL_STATUSES[item.status], value: item.status }}
                  onChange={selected => this.handleChange(selected.value, index, 'status')}
                  onInputKeyDown={this.onInputKeyDown}
                  menuPortalTarget={document.body}
                />
              </div>

              <div className="form-related-actions">
                <button
                  className="hl-primary-btn m-r-10"
                  onClick={() => this.toggleDelete(item, index)}
                  type="button"
                >
                  {item.isDeleted ? (
                    <FontAwesomeIcon icon="undo" />
                  ) : (
                    <i className="lilicon hl-trashcan-icon" />
                  )}
                </button>

                {!inline &&
                  index === items.length - 1 && (
                    <button className="hl-primary-btn" onClick={this.addRow} type="button">
                      <FontAwesomeIcon icon="plus" />
                    </button>
                  )}
              </div>

              {/* {error &&
                error[index].emailAddress && (
                  <div className="error-message">{error[index].emailAddress}</div>
                )} */}
            </div>
          );
        })}
      </React.Fragment>
    );
  }
}

export default EmailAddressField;
