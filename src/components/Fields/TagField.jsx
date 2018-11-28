import React, { Component } from 'react';
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable';
import { debounce } from 'debounce';

import { SELECT_STYLES, DEBOUNCE_WAIT } from 'lib/constants';
import Tag from 'models/Tag';

class TagField extends Component {
  handleChange = selected => {
    this.props.handleRelated('tags', selected);
  };

  search = async query => {
    const request = await Tag.query({ search: query, ordering: 'name' });

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
          loadOptions={debounce(this.search, DEBOUNCE_WAIT)}
          getOptionLabel={option => option.name}
          getOptionValue={option => option.name}
        />
      </React.Fragment>
    );
  }
}

export default TagField;
