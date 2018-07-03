import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

const emptyRow = { website: '' };

class EditableWebsites extends Component {
  componentDidMount = () => {
    if (this.props.value.length === 0) {
      this.props.addRow(emptyRow);
    }
  };

  onInputKeyDown = event => {
    if (event.keyCode === 27) {
      // Don't blur when Esc is pressed, but cancel the editing.
      event.preventDefault();
    }
  };

  handleChange = (value, index, field) => {
    const items = this.props.value;

    items[index][field] = value;

    this.props.handleChange(items);
  };

  toggleDelete = (item, index) => {
    this.handleChange(!item.isDeleted, index, 'isDeleted');
  };

  addRow = () => {
    this.props.addRow(emptyRow);
  };

  handleSubmit = () => {
    const data = this.props.value.filter(item => item.website);

    this.props.handleSubmit(data);
  };

  render() {
    const { value, error } = this.props;

    return (
      <span className="editable-input-wrap editable-stretched">
        {value.map((item, index) => {
          const hasError = error && error[index] && error[index].website;
          const rowClassName = cx('editable-related-row', {
            'is-deleted': item.isDeleted,
            'has-error': hasError
          });

          return (
            <div className={rowClassName} key={item.id || `row-${index}`}>
              <input
                autoFocus
                type="text"
                value={item.website}
                onChange={event => this.handleChange(event.target.value, index, 'website')}
                className="editable-input m-r-10"
                placeholder="Website"
              />

              <button className="hl-primary-btn" onClick={() => this.toggleDelete(item, index)}>
                {item.isDeleted ? (
                  <FontAwesomeIcon icon="undo" />
                ) : (
                  <i className="lilicon hl-trashcan-icon" />
                )}
              </button>

              {hasError && <div className="error-message">{error[index].website}</div>}
            </div>
          );
        })}

        <span className="editable-buttons">
          <button onClick={this.addRow}>
            <FontAwesomeIcon icon="plus" />
          </button>
          <button onClick={this.handleSubmit}>
            <FontAwesomeIcon icon="check" />
          </button>
          <button onClick={this.props.cancel}>
            <FontAwesomeIcon icon="times" />
          </button>
        </span>
      </span>
    );
  }
}

export default EditableWebsites;
