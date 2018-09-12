import React, { Component } from 'react';
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable';

import { SELECT_STYLES } from 'lib/constants';
import Tag from 'models/Tag';

class TagField extends Component {
  handleChange = selected => {
    this.props.handleRelated('tags', selected);
  };

  search = async query => {
    // TODO: This needs to have search query and sorting implemented.
    // Also needs to be changed from ES -> normal API.
    // Search the given model with the search query and any specific sorting.
    const request = await Tag.query(query);

    return request.hits;
  };

  render() {
    const { items } = this.props;

    return (
      <React.Fragment>
        <AsyncCreatableSelect
          defaultOptions
          isMulti
          allowCreateWhileLoading
          name="tags"
          value={items}
          classNamePrefix="editable-input"
          placeholder="Add tags..."
          styles={SELECT_STYLES}
          onChange={this.handleChange}
          loadOptions={this.search}
          getOptionLabel={option => option.name}
          getOptionValue={option => option.name}
        />
      </React.Fragment>
    );
  }
}

export default TagField;
