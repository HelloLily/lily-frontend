import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import Select from 'react-select';

import formatPhoneNumber from 'utils/formatPhoneNumber';

import {
  MOBILE_PHONE_TYPE,
  PHONE_TYPE_OPTIONS,
  PHONE_EMPTY_ROW,
  SELECT_STYLES
} from 'lib/constants';

class PhoneNumberField extends Component {
  componentDidMount() {
    if (this.props.items.length === 0) {
      this.addRow();
    }
  }

  handleChange = (value, index, field) => {
    const { items } = this.props;

    items[index][field] = value;

    this.handleRelated(items);
  };

  addRow = () => {
    const { items } = this.props;
    const newRow = Object.assign({}, PHONE_EMPTY_ROW);

    this.handleRelated([...items, newRow]);
  };

  handleRelated = items => {
    this.props.handleRelated('phoneNumbers', items);
  };

  handleBlur = (item, index) => {
    this.formatPhoneNumber(index);

    this.props.onInputBlur(item.number);
  };

  toggleDelete = (item, index) => {
    this.handleChange(!item.isDeleted, index, 'isDeleted');
  };

  formatPhoneNumber = index => {
    // TODO: Actual user should be used here.
    const user = { country: 'NL' };
    const { items } = this.props;

    // No need to format an empty value.
    if (items[index].number) {
      const address = this.props.addresses[0];
      const { formatted, isMobile } = formatPhoneNumber(items[index].number, user, address);

      if (formatted) {
        items[index].number = formatted;

        if (isMobile) {
          items[index].type = MOBILE_PHONE_TYPE;
        }
      }

      this.handleRelated(items);
    }
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
                type="text"
                value={item.number}
                onChange={event => this.handleChange(event.target.value, index, 'number')}
                className="editable-input"
                placeholder="Phone number"
                onBlur={() => this.handleBlur(item, index)}
              />

              <div className="w-30 m-l-10 m-r-10 text-capitalize">
                <Select
                  name="type"
                  styles={SELECT_STYLES}
                  options={PHONE_TYPE_OPTIONS}
                  value={{ value: item.type, label: item.type }}
                  onChange={selected => this.handleChange(selected.value, index, 'type')}
                  onInputKeyDown={this.onInputKeyDown}
                />
              </div>
              <div className="form-related-actions">
                <button
                  className="hl-primary-btn m-r-10"
                  onClick={() => this.toggleDelete(item, index)}
                >
                  {item.isDeleted ? (
                    <FontAwesomeIcon icon="undo" />
                  ) : (
                    <i className="lilicon hl-trashcan-icon" />
                  )}
                </button>

                {!inline &&
                  index === items.length - 1 && (
                    <button className="hl-primary-btn" onClick={this.addRow}>
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

export default PhoneNumberField;
