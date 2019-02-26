import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import Select from 'react-select';

import withContext from 'src/withContext';
import formatPhoneNumber from 'utils/formatPhoneNumber';

import {
  MOBILE_PHONE_TYPE,
  PHONE_TYPE_OPTIONS,
  PHONE_EMPTY_ROW,
  SELECT_STYLES
} from 'lib/constants';
import updateArray from 'utils/updateArray';

class PhoneNumberField extends Component {
  componentDidMount() {
    if (this.props.items.length === 0) this.addRow();
  }

  handleChange = (value, index, field) => {
    const { items } = this.props;

    const newItems = updateArray(items, value, index, field);

    this.handleRelated(newItems);
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
    const { items, currentUser } = this.props;

    // No need to format an empty value.
    if (items[index].number) {
      const address = this.props.addresses[0];
      const { formatted, isMobile } = formatPhoneNumber(items[index].number, currentUser, address);

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
    const { items, errors } = this.props;

    return (
      <React.Fragment>
        {items.map((item, index) => {
          const hasError = errors && errors[index] && errors[index].number;
          const rowClassName = cx('editable-related-row', {
            'is-deleted': item.isDeleted,
            'has-error': hasError
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

              <div className="last-field m-l-10 m-r-10 text-capitalize">
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
                  type="button"
                >
                  {item.isDeleted ? (
                    <FontAwesomeIcon icon={['far', 'undo']} />
                  ) : (
                    <FontAwesomeIcon icon={['far', 'trash-alt']} />
                  )}
                </button>

                {index === items.length - 1 && (
                  <button className="hl-primary-btn" onClick={this.addRow} type="button">
                    <FontAwesomeIcon icon={['far', 'plus']} />
                  </button>
                )}
              </div>

              {hasError && <div className="error-message">{errors[index].number}</div>}
            </div>
          );
        })}
      </React.Fragment>
    );
  }
}

export default withContext(PhoneNumberField);
