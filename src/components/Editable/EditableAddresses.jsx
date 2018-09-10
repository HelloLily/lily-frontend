import React, { Component } from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import Country from 'models/Country';

const addressTypes = [
  { value: 'visiting', label: 'Visiting address' },
  { value: 'billing', label: 'Billing address' },
  { value: 'shipping', label: 'Shipping address' },
  { value: 'home', label: 'Home address' },
  { value: 'other', label: 'Other' }
];

const emptyRow = { address: '', type: 'visiting' };

class EditableAddresses extends Component {
  constructor(props) {
    super(props);

    this.state = { countries: {}, countryOptions: [] };
  }

  componentDidMount = async () => {
    const countryRequest = await Country.query();

    const countries = countryRequest.results;

    const countryOptions = Object.entries(countries).map(([code, country]) => ({
      value: code,
      label: country
    }));

    this.setState({ countries, countryOptions });

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
    const data = this.props.value.filter(item => item.address);

    this.props.handleSubmit(data);
  };

  render() {
    const { value, selectStyles, error } = this.props;

    return (
      <span className="editable-input-wrap editable-stretched">
        {value.map((item, index) => {
          const addressType = addressTypes.find(type => type.value === item.type);
          const hasError = error && error[index] && error[index].address;
          const rowClassName = cx('editable-related-row', {
            'is-deleted': item.isDeleted,
            'has-error': hasError
          });

          return (
            <div className={rowClassName} key={item.id || `row-${index}`}>
              <div className="editable-addresses">
                <div className="address-row">
                  <div className="display-flex">
                    <input
                      autoFocus
                      type="text"
                      value={item.address}
                      onChange={event => this.handleChange(event.target.value, index, 'address')}
                      className="editable-input"
                      placeholder="Address"
                    />

                    <input
                      type="text"
                      value={item.postalCode}
                      onChange={event => this.handleChange(event.target.value, index, 'postalCode')}
                      className="editable-input w-30 m-l-10 m-r-10"
                      placeholder="Postal code"
                    />
                  </div>

                  <div className="display-flex m-t-10">
                    <input
                      type="text"
                      value={item.city}
                      onChange={event => this.handleChange(event.target.value, index, 'city')}
                      className="editable-input w-30"
                      placeholder="City"
                    />

                    <div className="w-30 m-l-10 m-r-10">
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

                    <div className="w-30 m-r-10">
                      <Select
                        name="type"
                        styles={selectStyles}
                        options={addressTypes}
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
                  <FontAwesomeIcon icon="undo" />
                ) : (
                  <i className="lilicon hl-trashcan-icon" />
                )}
              </button>

              {error &&
                error[index].address && <div className="error-message">{error[index].address}</div>}
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

export default EditableAddresses;
