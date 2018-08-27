import React, { Component } from 'react';
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable';

import { SELECT_STYLES } from 'lib/constants';
import Tag from 'models/Tag';

class TagField extends Component {
  handleRelated = items => {
    this.props.handleRelated('websites', items);
  };

  handleChange = selected => {
    const items = selected.map(item => item.value);

    this.props.handleRelated('tags', items);
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

    const options = items.map(item => ({ value: item, label: item.name }));

    return (
      <React.Fragment>
        <AsyncCreatableSelect
          defaultOptions
          isMulti
          allowCreateWhileLoading
          name="tags"
          classNamePrefix="editable-input"
          placeholder="Add tags..."
          value={options}
          styles={SELECT_STYLES}
          onChange={this.handleChange}
          loadOptions={this.search}
          getOptionLabel={option => option.name}
        />

        {/* {error &&
          error[index].emailAddress && (
            <div className="error-message">{error[index].emailAddress}</div>
          )} */}
      </React.Fragment>
    );
  }
}

export default TagField;
