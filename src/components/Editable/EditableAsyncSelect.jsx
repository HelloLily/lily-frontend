import React, { Component } from 'react';
import AsyncSelect from 'react-select/lib/Async';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import { get } from 'src/lib/api';

class EditableSelect extends Component {
  onInputKeyDown = event => {
    if (this.props.multi && event.keyCode === 13 && event.metaKey) {
      // Instead of showing the options when 'Meta' key + 'Enter' are pressed we submit the form.
      event.preventDefault();
    }

    if (event.keyCode === 27) {
      // Don't blur when Esc is pressed, but cancel the editing.
      event.preventDefault();
    }
  };

  handleMultiSubmit = () => {
    const values = this.props.value.map(item => ({ id: item.id }));

    this.props.handleSubmit(values);
  };

  handleChange = selected => {
    if (this.props.multi) {
      this.handleMultiSelect(selected);
    } else {
      this.handleSingleSelect(selected);
    }
  };

  handleSingleSelect = selected => {
    const value = selected ? selected.value : null;

    this.props.handleChange(value);

    const args = {
      id: this.props.object.id,
      [this.props.field]: value ? value.id : value
    };

    this.props.handleSubmit(args);
  };

  handleMultiSelect = selected => {
    const values = selected.map(item => item.value);

    this.props.handleChange(values);
  };

  search = async query => {
    const { model } = this.props.selectConfig;

    // TODO: This needs to have search query and sorting implemented.
    // Search the given model with the search query and any specific sorting.
    const request = await get(`/${model}/`);
    const options = this.props.createOptions(request.results);

    return options;
  };

  filterOptions = (options, filter, currentValues) => {
    if (this.props.multi) {
      return options.filter(
        option => !currentValues.some(value => value.value.id === option.value.id)
      );
    }

    return options;
  };

  render() {
    const { value, selectConfig, multi, selectStyles } = this.props;

    let options;

    if (multi) {
      options = value.map(item => ({ value: item, label: item[selectConfig.display] }));
    } else {
      const label = value ? value[selectConfig.display] : null;
      options = { value, label };
    }

    return (
      <span className={`editable-input-wrap${multi ? ' editable-multi' : ''}`}>
        <AsyncSelect
          autoFocus
          defaultOptions
          name="options"
          className="editable-input"
          value={options}
          isMulti={multi}
          styles={selectStyles}
          onChange={this.handleChange}
          loadOptions={this.search}
          onInputKeyDown={this.onInputKeyDown}
          onBlur={this.props.cancel}
        />

        {multi && (
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
        )}
      </span>
    );
  }
}

export default EditableSelect;
