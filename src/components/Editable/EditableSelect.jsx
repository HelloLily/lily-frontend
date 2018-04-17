import React, { Component } from 'react';
import { Async } from 'react-select';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import { get } from 'src/lib/api';

class EditableSelect extends Component {
  handleMultiSubmit = () => {
    const values = this.props.value.map(item => ({ id: item.id }));

    const args = {
      id: this.props.object.id,
      [this.props.field]: values
    };

    this.props.handleSubmit(args);
  }

  handleChange = selected => {
    if (this.props.multi) {
      this.handleMultiSelect(selected);
    } else {
      this.handleSingleSelect(selected);
    }
  }

  handleSingleSelect = selected => {
    const value = selected ? selected.value : null;

    this.props.handleChange(value);

    const args = {
      id: this.props.object.id,
      [this.props.field]: value ? value.id : value
    }

    this.props.handleSubmit(args);
  }

  handleMultiSelect = selected => {
    const values = selected.map(item => item.value);

    this.props.handleChange(values);
  }

  search = async query => {
    const { model, display } = this.props.searchMapping;

    // TODO: This needs to have search query and sorting implemented.
    // Search the given model with the search query and any specific sorting.
    const request = await get(`/${model}/`);

    const options = request.results.map(result => ({ value: result, label: result[display] }));

    return { options };
  }

  render() {
    const { value, searchMapping, multi } = this.props;

    let options;

    if (multi) {
      options = value.map(item => ({ value: item, label: item[searchMapping.display] }));
    } else {
      const label = value ? value[searchMapping.display] : null;
      options = { value, label };
    }

    const className = `editable-wrap${multi ? ' editable-multi' : ''}`;

    return (
      <span className={className}>
        <Async
          name="options"
          className="editable-input"
          value={options}
          onChange={this.handleChange}
          loadOptions={this.search}
          multi={multi}
        />

        {multi &&
          <div className="editable-multi-actions">
            <div className="float-right">
              <button type="submit" className="hl-primary-btn no-background no-border" onClick={this.handleMultiSubmit}><FontAwesomeIcon icon="check" /></button>
              <button type="button" className="hl-primary-btn no-background no-border" onClick={this.cancel}><FontAwesomeIcon icon="times" /></button>
            </div>
          </div>
        }
      </span>
    );
  }
}

export default EditableSelect;
