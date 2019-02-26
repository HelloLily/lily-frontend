import React, { Component } from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import { ADDRESS_TYPES, ADDRESS_EMPTY_ROW, ESCAPE_KEY } from 'lib/constants';
import updateArray from 'utils/updateArray';
import Utils from 'models/Utils';

class EditableAddresses extends Component {
  constructor(props) {
    super(props);

    this.state = { countries: {}, countryOptions: [] };
  }

  async componentDidMount() {
    const countryRequest = await Utils.countries();
    const countries = countryRequest.results;
    const countryOptions = Object.entries(countries).map(([code, country]) => ({
      value: code,
      label: country
    }));

    this.setState({ countries, countryOptions });

    if (this.props.value.length === 0) {
      this.props.addRow(ADDRESS_EMPTY_ROW);
    }
  }

  onInputKeyDown = event => {
    if (event.keyCode === ESCAPE_KEY) {
      // Don't blur when Esc is pressed, but cancel the editing.
      event.preventDefault();
    }
  };

  handleChange = (value, index, field) => {
    const items = this.props.value;
    const newItems = updateArray(items, value, index, field);

    this.props.handleChange(newItems);
  };

  toggleDelete = (item, index) => {
    this.handleChange(!item.isDeleted, index, 'isDeleted');
  };

  addRow = () => {
    this.props.addRow(ADDRESS_EMPTY_ROW);
  };

  handleSubmit = () => {
    const data = this.props.value.map(item => {
      if (!item.address) {
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

  render() {
    const { value, selectStyles, error } = this.props;

    return (
      <span className="editable-input-wrap editable-stretched">
        {value.map((item, index) => {
          const addressType = ADDRESS_TYPES.find(type => type.value === item.type);
          const hasError = error && error[index] && error[index].address;
          const rowClassName = cx('editable-related-row', {
            'is-deleted': item.isDeleted,
            'has-error': hasError
          });

          return (
            <div className={rowClassName} key={item.id || `row-${index}`}>
              <div className="editable-addresses">
                <div className="address-row">
                  <div className="m-r-10">
                    <input
                      autoFocus
                      type="text"
                      value={item.address}
                      onChange={event => this.handleChange(event.target.value, index, 'address')}
                      className="editable-input w-100"
                      placeholder="Address"
                    />
                  </div>

                  <div className="display-flex m-t-10">
                    <div className="w-50 m-r-10">
                      <input
                        type="text"
                        value={item.postalCode}
                        onChange={event =>
                          this.handleChange(event.target.value, index, 'postalCode')
                        }
                        className="editable-input w-100"
                        placeholder="Postal code"
                      />
                    </div>

                    <div className="w-50 m-r-10">
                      <input
                        type="text"
                        value={item.city}
                        onChange={event => this.handleChange(event.target.value, index, 'city')}
                        className="editable-input w-100"
                        placeholder="City"
                      />
                    </div>
                  </div>

                  <div className="display-flex m-t-10">
                    <div className="w-50 m-r-10">
                      <Select
                        name="country"
                        styles={selectStyles}
                        options={this.state.countryOptions}
                        value={{ value: item.country, label: this.state.countries[item.country] }}
                        onChange={selected => this.handleChange(selected.value, index, 'country')}
                        onInputKeyDown={this.onInputKeyDown}
                        menuPortalTarget={document.body}
                      />
                    </div>

                    <div className="w-50 m-r-10">
                      <Select
                        name="type"
                        styles={selectStyles}
                        options={ADDRESS_TYPES}
                        value={{ value: item.type, label: addressType.label }}
                        onChange={selected => this.handleChange(selected.value, index, 'type')}
                        onInputKeyDown={this.onInputKeyDown}
                        menuPortalTarget={document.body}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button className="hl-primary-btn" onClick={() => this.toggleDelete(item, index)}>
                {item.isDeleted ? (
                  <FontAwesomeIcon icon={['far', 'undo']} />
                ) : (
                  <FontAwesomeIcon icon={['far', 'trash-alt']} />
                )}
              </button>

              {error && error[index].address && (
                <div className="error-message">{error[index].address}</div>
              )}
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

export default EditableAddresses;
