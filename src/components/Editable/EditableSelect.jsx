import React, { Component } from 'react';
import { Async } from 'react-select';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import { get } from 'src/lib/api';

class EditableSelect extends Component {
  onInputKeyDown = event => {
    if (this.props.multi) {
      // Default behavior is to open the options, but we want to prevent that.
      if (event.keyCode === 13) {
        event.preventDefault();
        this.handleMultiSubmit();
      }
    }
  }

  handleMultiSubmit = () => {
    const values = this.props.value.map(item => ({ id: item.id }));

    this.props.handleSubmit(values);
  }

  handleChange = selected => {
    if (this.props.multi) {
      this.handleMultiSelect(selected);
    } else {
      this.handleSingleSelect(selected);
    }
  }

  handleSingleSelect = selected => {
    const value = selected ? selected.value : null;

    this.props.handleChange(value);

    const args = {
      id: this.props.object.id,
      [this.props.field]: value ? value.id : value
    };

    this.props.handleSubmit(args);
  }

  handleMultiSelect = selected => {
    const values = selected.map(item => item.value);

    this.props.handleChange(values);
  }

  search = async query => {
    const { model, display } = this.props.searchMapping;

    // TODO: This needs to have search query and sorting implemented.
    // Search the given model with the search query and any specific sorting.
    const request = await get(`/${model}/`);

    const options = request.results.map(result => ({ value: result, label: result[display] }));

    return { options };
  }

  filterOptions = (options, filter, currentValues) => {
    if (this.props.multi) {
      return options.filter(option => !currentValues.some(value => value.value.id === option.value.id));
    }

    return options;
  }

  render() {
    const { value, searchMapping, multi } = this.props;

    let options;

    if (multi) {
      options = value.map(item => ({ value: item, label: item[searchMapping.display] }));
    } else {
      const label = value ? value[searchMapping.display] : null;
      options = { value, label };
    }

    const className = `editable-input-wrap${multi ? ' editable-multi' : ''}`;

    return (
      <span className={className}>
        <Async
          name="options"
          className="editable-input"
          value={options}
          onChange={this.handleChange}
          loadOptions={this.search}
          multi={multi}
          filterOptions={this.filterOptions}
          onInputKeyDown={this.onInputKeyDown}
          autoFocus
        />

        {multi &&
          <div className="editable-multi-actions m-t-5">
            <div className="float-right">
              <button
                type="submit"
                className="hl-primary-btn no-background no-border"
                onClick={this.handleMultiSubmit}
              >
                <FontAwesomeIcon icon="check" />
              </button>

              <button
                type="button"
                className="hl-primary-btn no-background no-border"
                onClick={this.props.cancel}
              >
                <FontAwesomeIcon icon="times" />
              </button>
            </div>
          </div>
        }
      </span>
    );
  }
}

export default EditableSelect;
