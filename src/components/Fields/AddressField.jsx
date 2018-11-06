import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import Select from 'react-select';

import withContext from 'src/withContext';
import { ADDRESS_TYPES, ADDRESS_EMPTY_ROW, SELECT_STYLES } from 'lib/constants';
import Country from 'models/Country';

class AddressField extends Component {
  constructor(props) {
    super(props);

    this.state = { countries: {}, countryOptions: [] };
  }

  async componentDidMount() {
    const countryRequest = await Country.query();
    const countries = countryRequest.results;
    const countryOptions = Object.entries(countries).map(([code, country]) => ({
      value: code,
      label: country
    }));

    this.setState({ countries, countryOptions });

    if (this.props.items.length === 0) this.addRow();
  }

  handleChange = (value, index, field) => {
    const { items } = this.props;

    items[index][field] = value;

    this.handleRelated(items);
  };

  addRow = () => {
    const { items, currentUser } = this.props;
    const newRow = Object.assign({}, ADDRESS_EMPTY_ROW);

    if (currentUser.tenant.country) {
      newRow.country = currentUser.tenant.country;
    }

    this.handleRelated([...items, newRow]);
  };

  handleRelated = items => {
    this.props.handleRelated('addresses', items);
  };

  toggleDelete = (item, index) => {
    this.handleChange(!item.isDeleted, index, 'isDeleted');
  };

  render() {
    const { items, inline } = this.props;

    return (
      <React.Fragment>
        {items.map((item, index) => {
          const addressType = ADDRESS_TYPES.find(type => type.value === item.type);
          // const hasError = error && error[index] && error[index].emailAddress;
          const rowClassName = cx('editable-related-row', {
            'is-deleted': item.isDeleted
            // 'has-error': hasError
          });

          return (
            <div className={rowClassName} key={item.id || `row-${index}`}>
              <div className="editable-addresses">
                <div className="address-row">
                  <div className="display-flex">
                    <input
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
                        styles={SELECT_STYLES}
                        options={this.state.countryOptions}
                        value={{ value: item.country, label: this.state.countries[item.country] }}
                        onChange={selected => this.handleChange(selected.value, index, 'country')}
                        onInputKeyDown={this.onInputKeyDown}
                      />
                    </div>

                    <div className="w-30 m-r-10">
                      <Select
                        name="type"
                        styles={SELECT_STYLES}
                        options={ADDRESS_TYPES}
                        value={{ value: item.type, label: addressType.label }}
                        onChange={selected => this.handleChange(selected.value, index, 'type')}
                        onInputKeyDown={this.onInputKeyDown}
                      />
                    </div>
                  </div>
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

export default withContext(AddressField);
