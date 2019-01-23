import React, { Component } from 'react';
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import debounce from 'debounce-promise';

import Tag from 'models/Tag';
import { ESCAPE_KEY, DEBOUNCE_WAIT } from 'lib/constants';

class EditableTags extends Component {
  onInputKeyDown = event => {
    if (event.keyCode === ESCAPE_KEY) {
      // Don't blur when Esc is pressed, but cancel the editing.
      event.preventDefault();
    }
  };

  handleChange = (selected, changeProps) => {
    if (changeProps.action === 'remove-value' || changeProps.action === 'pop-value') {
      // Value get's removed from array, so no need to set isDeleted for new items.
      if (changeProps.removedValue.hasOwnProperty('id')) {
        selected.push({ ...changeProps.removedValue, isDeleted: true });
      }
    }

    this.props.handleChange(selected);
  };

  createTag = option => {
    const { value } = this.props;

    value.push({ name: option });

    this.props.handleChange(value);
  };

  search = async (query = '') => {
    const request = await Tag.query({ search: query, ordering: '-modified' });

    return this.createOptions(request.results);
  };

  getNewOptionData = (inputValue, optionLabel) => ({ name: optionLabel });

  checkValidity = (inputValue, selectValue) =>
    inputValue ? selectValue.findIndex(option => option.name === inputValue) === -1 : false;

  handleSubmit = () => {
    const data = this.props.value.filter(item => item.name);
    const args = {
      id: this.props.object.id,
      [this.props.field]: data
    };

    this.props.handleSubmit(args);
  };

  render() {
    const { selectStyles } = this.props;

    const items = this.props.value.filter(item => !item.isDeleted);

    return (
      <span className="editable-input-wrap editable-multi">
        <AsyncCreatableSelect
          autoFocus
          defaultOptions
          isMulti
          allowCreateWhileLoading
          value={items}
          classNamePrefix="editable-input"
          placeholder="Add tags..."
          styles={selectStyles}
          onChange={this.handleChange}
          loadOptions={debounce(this.search, DEBOUNCE_WAIT)}
          onCreateOption={this.createTag}
          getOptionLabel={option => option.name}
          getOptionValue={option => option.name}
          isValidNewOption={this.checkValidity}
          getNewOptionData={this.getNewOptionData}
        />

        <div className="editable-multi-actions m-t-5">
          <div>
            <button type="submit" className="hl-primary-btn borderless" onClick={this.handleSubmit}>
              <FontAwesomeIcon icon="check" />
            </button>

            <button type="button" className="hl-primary-btn borderless" onClick={this.props.cancel}>
              <FontAwesomeIcon icon="times" />
            </button>
          </div>
        </div>
      </span>
    );
  }
}

export default EditableTags;
