import React, { Component } from 'react';
import Select, { components } from 'react-select';

import { get } from 'src/lib/api';

class EditableIconSelect extends Component {
  constructor(props) {
    super(props);

    this.state = { options: [] };
  }

  componentDidMount = async () => {
    const { model } = this.props.selectConfig;
    // Fetch data for the given model.
    const request = await get(`/${model}/`);
    const options = this.props.createOptions(request.results);

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

    setTimeout(() => {
      this.props.handleSubmit();
    });
  }

  IconOption = props => {
    const iconClass = `${this.props.selectConfig.iconClass}${props.label.toLowerCase()}`;

    return (
      <components.Option {...props}>
        <i className={`${iconClass} m-r-5`} />

        {props.label}
      </components.Option>
    );
  };

  render() {
    const { value, selectConfig } = this.props;

    let label = value;

    if (value !== null) {
      label = this.props.object[selectConfig.display] || value.name;
    }

    label = (
      <React.Fragment>
        <i className={`${selectConfig.iconClass}${label.toLowerCase()} m-r-5`} /> {label}
      </React.Fragment>
    );

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
          components={{ Option: this.IconOption }}
          autoFocus
        />
      </span>
    );
  }
}

export default EditableIconSelect;
