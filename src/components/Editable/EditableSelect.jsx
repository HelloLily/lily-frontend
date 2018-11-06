import React, { Component } from 'react';
import Select from 'react-select';

import { get } from 'src/lib/api';
import { ESCAPE_KEY } from 'lib/constants';

class EditableSelect extends Component {
  constructor(props) {
    super(props);

    this.state = { options: [] };
  }

  async componentDidMount() {
    const { model } = this.props.selectConfig;

    let options;

    if (!this.props.selectConfig.options) {
      // Fetch data for the given model.
      const request = await get(`/${model}/`);
      options = request.results;
    } else {
      ({ options } = this.props.selectConfig);
    }

    options = this.props.createOptions(options);

    this.setState({ options });
  }

  onInputKeyDown = event => {
    if (event.keyCode === ESCAPE_KEY) {
      // Don't blur when Esc is pressed, but cancel the editing.
      event.preventDefault();
    }
  };

  handleChange = selected => {
    const value = selected ? selected.value : null;

    this.props.handleChange(value);

    setTimeout(() => {
      this.props.handleSubmit();
    });
  };

  render() {
    const { options } = this.state;
    const { value, selectConfig, selectStyles } = this.props;

    let label = value;

    if (value !== undefined) {
      if (value instanceof Object) {
        label = value[selectConfig.display] || value.name;
      } else {
        label = this.props.object[selectConfig.display];
      }
    }

    const option = { value, label };

    return (
      <span className="editable-input-wrap">
        <Select
          autoFocus
          name="options"
          className="editable-input"
          value={option}
          styles={selectStyles}
          onChange={this.handleChange}
          options={options}
          onInputKeyDown={this.onInputKeyDown}
          menuPortalTarget={document.body}
          onBlur={this.props.cancel}
        />
      </span>
    );
  }
}

export default EditableSelect;
