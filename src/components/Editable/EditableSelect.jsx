import React, { Component } from 'react';
import Select from 'react-select';

import { get } from 'src/lib/api';

class EditableSelect extends Component {
  constructor(props) {
    super(props);

    this.state = { options: [] };
  }

  componentDidMount = async () => {
    const { model } = this.props.searchMapping;
    const display = this.props.searchMapping.display || 'name';
    // Fetch data for the given model.
    const request = await get(`/${model}/`);
    const options = request.results.map(result => ({ value: result, label: result[display] }));

    this.setState({ options });
  }

  onInputKeyDown = event => {
    if (event.keyCode === 27) {
      // Don't blur when Esc is pressed, but cancel the editing.
      event.preventDefault();
    }
  }

  handleChange = selected => {
    const value = selected ? selected.value : null;

    this.props.handleChange(value);

    this.props.handleSubmit();
  }

  render() {
    const { value, searchMapping } = this.props;

    let label = value;

    if (value) {
      label = value[searchMapping.display] || value.name;
    }

    const option = { value, label };

    return (
      <span className="editable-input-wrap">
        <Select
          name="options"
          className="editable-input"
          value={option}
          onChange={this.handleChange}
          options={this.state.options}
          onInputKeyDown={this.onInputKeyDown}
          autoFocus
        />
      </span>
    );
  }
}

export default EditableSelect;
