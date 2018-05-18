import React, { Component } from 'react';
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import Tag from 'models/Tag';

class EditableTags extends Component {
  onInputKeyDown = event => {
    if (event.keyCode === 27) {
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
    const options = this.props.createOptions(request.hits);

    return options;
  };

  render() {
    const { value, selectStyles } = this.props;

    const options = value.map(item => ({ value: item, label: item.name }));

    return (
      <span className="editable-input-wrap editable-multi">
        <AsyncCreatableSelect
          autoFocus
          defaultOptions
          isMulti
          allowCreateWhileLoading
          name="options"
          className="editable-input"
          value={options}
          styles={selectStyles}
          onChange={this.handleChange}
          loadOptions={this.search}
          onInputKeyDown={this.onInputKeyDown}
          onBlur={this.props.cancel}
        />

        <div className="editable-multi-actions m-t-5">
          <div>
            <button
              type="submit"
              className="hl-primary-btn no-background no-border"
              onClick={this.handleSubmit}
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
      </span>
    );
  }
}

export default EditableTags;
