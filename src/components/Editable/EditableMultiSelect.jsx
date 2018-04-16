import React, { Component } from 'react';
import { Async } from 'react-select';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import { get } from 'src/lib/api';

class EditableSelect extends Component {
  constructor(props) {
    super(props);
  }

  handleSubmit = () => {
    const args = {
      id: this.props.object.id,
      [this.props.field]: this.props.value
    }

    this.props.handleSubmit(args);
  }

  handleChange = selected => {
    const value = selected ? selected.value : null;

    this.props.handleChange(value);

    const args = {
      id: this.props.object.id,
      [this.props.field]: value ? value.id : value
    }

    this.props.handleSubmit(args);
  }

  search = async query => {
    const { model, display } = this.props.searchMapping[this.props.field];

    // TODO: This needs to have search query and sorting implemented.
    // Search the given model with the search query and any specific sorting.
    const request = await get(`/${model}/`);

    const options = request.results.map(result => {
      return { value: result, label: result[display] };
    });

    return { options };
  }

  render() {
    const { field, value } = this.props;
    const label = value ? value[this.props.searchMapping[field].display] : null;
    const currentOption = { value, label };

    return (
      <span className="editable-wrap">
        <Async
          name="options"
          className="editable-input"
          value={currentOption}
          onChange={this.handleChange}
          loadOptions={this.search}
        />
      </span>
    );
  }
}

export default EditableSelect;
