import React, { Component } from 'react';
import AsyncSelect from 'react-select/lib/Async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { debounce } from 'debounce';

import { get } from 'src/lib/api';
import { ENTER_KEY, ESCAPE_KEY, DEBOUNCE_WAIT } from 'lib/constants';

class EditableSelect extends Component {
  onInputKeyDown = event => {
    if (this.props.multi && event.keyCode === ENTER_KEY && event.metaKey) {
      // Instead of showing the options when 'Meta' key + 'Enter' are pressed we submit the form.
      event.preventDefault();
    }

    if (event.keyCode === ESCAPE_KEY) {
      // Don't blur when Esc is pressed, but cancel the editing.
      event.preventDefault();
    }
  };

  handleMultiSubmit = () => {
    const values = this.props.value.map(item => ({ id: item.id }));
    const args = {
      id: this.props.object.id,
      [this.props.field]: values
    };

    this.props.handleSubmit(args);
  };

  handleChange = selected => {
    if (this.props.multi) {
      this.handleMultiSelect(selected);
    } else {
      this.handleSingleSelect(selected);
    }
  };

  handleSingleSelect = async selected => {
    const args = {
      id: this.props.object.id,
      [this.props.field]: selected ? selected.id : selected
    };

    await this.props.handleChange(selected);

    this.props.handleSubmit(args);
  };

  handleMultiSelect = selected => {
    this.props.handleChange(selected);
  };

  handleBlur = () => {
    if (!this.props.multi) {
      this.props.cancel();
    }
  };

  search = async query => {
    const { model } = this.props.selectConfig;
    // TODO: This needs to have search query and sorting implemented.
    // Search the given model with the search query and any specific sorting.
    const request = await get(`/${model}/`, { query });

    return request.results;
  };

  render() {
    const { value, selectConfig, multi, selectStyles } = this.props;

    return (
      <span className={`editable-input-wrap${multi ? ' editable-multi' : ''}`}>
        <AsyncSelect
          autoFocus
          defaultOptions
          isClearable
          name="options"
          className="editable-input"
          value={value}
          isMulti={multi}
          styles={selectStyles}
          onChange={this.handleChange}
          loadOptions={debounce(this.search, DEBOUNCE_WAIT)}
          onInputKeyDown={this.onInputKeyDown}
          onBlur={this.handleBlur}
          menuPortalTarget={document.body}
          getOptionLabel={option => option[selectConfig.display]}
          getOptionValue={option => option.id}
        />

        {multi && (
          <div className="editable-multi-actions m-t-5">
            <div>
              <button
                type="submit"
                className="hl-primary-btn borderless"
                onClick={this.handleMultiSubmit}
              >
                <FontAwesomeIcon icon="check" />
              </button>

              <button
                type="button"
                className="hl-primary-btn borderless"
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
