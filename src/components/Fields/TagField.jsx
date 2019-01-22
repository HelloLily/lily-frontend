import React, { Component } from 'react';
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable';
import debounce from 'debounce-promise';

import { SELECT_STYLES, DEBOUNCE_WAIT } from 'lib/constants';
import Tag from 'models/Tag';

class TagField extends Component {
  handleChange = (selected, changeProps) => {
    if (changeProps.action === 'remove-value' || changeProps.action === 'pop-value') {
      // Value get's removed from array, so no need to set isDeleted for new items.
      if (changeProps.removedValue.hasOwnProperty('id')) {
        selected.push({ ...changeProps.removedValue, isDeleted: true });
      }
    }

    this.props.handleRelated('tags', selected);
  };

  createTag = option => {
    const { items } = this.props;

    items.push({ name: option });

    this.props.handleRelated('tags', items);
  }

  search = async (query = '') => {
    const request = await Tag.query({ search: query, ordering: '-modified' });

    return this.createOptions(request.results);
  };

  getNewOptionData = (inputValue, optionLabel) => ({ name: optionLabel });

  checkValidity = (inputValue, selectValue) =>
    inputValue ? selectValue.findIndex(option => option.name === inputValue) === -1 : false;

  render() {
    const items = this.props.items.filter(item => !item.isDeleted);

    return (
      <React.Fragment>
        <AsyncCreatableSelect
          defaultOptions
          isMulti
          allowCreateWhileLoading
          value={items}
          classNamePrefix="editable-input"
          placeholder="Add tags..."
          styles={SELECT_STYLES}
          onChange={this.handleChange}
          loadOptions={debounce(this.search, DEBOUNCE_WAIT)}
          onCreateOption={this.createTag}
          getOptionLabel={option => option.name}
          getOptionValue={option => option.name}
          isValidNewOption={this.checkValidity}
          getNewOptionData={this.getNewOptionData}
        />
      </React.Fragment>
    );
  }
}

export default TagField;
