import React, { Component } from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import { SOCIAL_MEDIA_OPTIONS, SOCIAL_MEDIA_EMPTY_ROW, ESCAPE_KEY } from 'lib/constants';
import SocialMediaIcon from 'components/Utils/SocialMediaIcon';

class EditableSocialMedia extends Component {
  componentDidMount = () => {
    if (this.props.value.length === 0) {
      this.props.addRow(SOCIAL_MEDIA_EMPTY_ROW);
    }
  };

  onInputKeyDown = event => {
    if (event.keyCode === ESCAPE_KEY) {
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
    this.props.addRow(SOCIAL_MEDIA_EMPTY_ROW);
  };

  handleBlur = index => {
    const items = this.props.value;
    // Regex to test for some common social media sites.
    const regex = /(twitter|linkedin|facebook)/;
    const match = items[index].username.match(regex);

    if (match) {
      items[index].name = match[1];
    }

    this.props.handleChange(items);
  };

  handleSubmit = () => {
    const data = this.props.value.filter(item => item.username);
    const args = {
      id: this.props.object.id,
      socialMedia: data
    };

    this.props.handleSubmit(args);
  };

  render() {
    const { value, selectStyles, error } = this.props;

    return (
      <span className="editable-input-wrap editable-stretched">
        {value.map((item, index) => {
          const socialType = SOCIAL_MEDIA_OPTIONS.find(type => type.value === item.name);
          const hasError = error && error[index] && error[index].username;
          const rowClassName = cx('editable-related-row', {
            'is-deleted': item.isDeleted,
            'has-error': hasError
          });

          return (
            <div className={rowClassName} key={item.id || `row-${index}`}>
              <div className="input-addon">
                <div className="input-addon-icon">
                  <SocialMediaIcon item={item} />
                </div>
                <input
                  type="text"
                  className="editable-input m-r-10"
                  placeholder="Username"
                  value={item.username}
                  onBlur={() => this.handleBlur(index)}
                  onChange={event => this.handleChange(event.target.value, index, 'username')}
                />
              </div>

              <div className="m-l-10 m-r-10 flex-grow">
                <Select
                  name="status"
                  styles={selectStyles}
                  options={SOCIAL_MEDIA_OPTIONS}
                  value={{ value: item.name, label: socialType.label }}
                  onChange={selected => this.handleChange(selected.value, index, 'name')}
                  onInputKeyDown={this.onInputKeyDown}
                  menuPortalTarget={document.body}
                />
              </div>

              <button className="hl-primary-btn" onClick={() => this.toggleDelete(item, index)}>
                {item.isDeleted ? (
                  <FontAwesomeIcon icon={['far', 'undo']} />
                ) : (
                  <FontAwesomeIcon icon={['far', 'trash-alt']} />
                )}
              </button>

              {hasError && <div className="error-message">{error[index].username}</div>}
            </div>
          );
        })}

        <span className="editable-buttons">
          <button onClick={this.addRow}>
            <FontAwesomeIcon icon={['far', 'plus']} />
          </button>
          <button onClick={this.handleSubmit}>
            <FontAwesomeIcon icon={['far', 'check']} />
          </button>
          <button onClick={this.props.cancel}>
            <FontAwesomeIcon icon={['far', 'times']} />
          </button>
        </span>
      </span>
    );
  }
}

export default EditableSocialMedia;
