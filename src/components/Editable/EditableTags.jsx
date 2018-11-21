import React, { Component } from 'react';
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { debounce } from 'debounce';

import Tag from 'models/Tag';
import { ESCAPE_KEY, DEBOUNCE_WAIT } from 'lib/constants';

class EditableTags extends Component {
  onInputKeyDown = event => {
    if (event.keyCode === ESCAPE_KEY) {
      // Don't blur when Esc is pressed, but cancel the editing.
      event.preventDefault();
    }
  };

  handleChange = selected => {
    const values = selected.map(item => item.value);

    this.props.handleChange(values);
  };

  search = async query => {
    // TODO: This needs to have search query and sorting implemented.
    // Also needs to be changed from ES -> normal API.
    // Search the given model with the search query and any specific sorting.
    const request = await Tag.query(query);

    return request.hits;
  };

  render() {
    const { value, selectStyles } = this.props;

    return (
      <span className="editable-input-wrap editable-multi">
        <AsyncCreatableSelect
          autoFocus
          defaultOptions
          isMulti
          allowCreateWhileLoading
          name="options"
          placeholder="Add tags..."
          value={value}
          styles={selectStyles}
          onChange={this.handleChange}
          loadOptions={debounce(this.search, DEBOUNCE_WAIT)}
          onInputKeyDown={this.onInputKeyDown}
          onBlur={this.props.cancel}
          getOptionLabel={option => option.name}
          getOptionValue={option => option.name}
          menuPortalTarget={document.body}
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
