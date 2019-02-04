import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import Select from 'react-select';

import { SOCIAL_MEDIA_EMPTY_ROW, SOCIAL_MEDIA_OPTIONS, SELECT_STYLES } from 'lib/constants';
import SocialMediaIcon from 'components/Utils/SocialMediaIcon';

class SocialMediaField extends Component {
  componentDidMount() {
    if (this.props.items.length === 0) this.addRow();
  }

  handleChange = (value, index, field) => {
    const { items } = this.props;

    items[index][field] = value;

    this.handleRelated(items);
  };

  handleRelated = items => {
    this.props.handleRelated('socialMedia', items);
  };

  addRow = () => {
    const { items } = this.props;
    const newRow = Object.assign({}, SOCIAL_MEDIA_EMPTY_ROW);

    this.handleRelated([...items, newRow]);
  };

  toggleDelete = (item, index) => {
    this.handleChange(!item.isDeleted, index, 'isDeleted');
  };

  handleBlur = index => {
    const { items } = this.props;
    // Regex to test for some common social media sites.
    const regex = /(twitter|linkedin|facebook)/;
    const match = items[index].username.match(regex);

    if (match) {
      items[index].name = match[1];
    }

    this.handleRelated(items);
  };

  render() {
    const { items, errors } = this.props;

    return (
      <React.Fragment>
        {items.map((item, index) => {
          const socialType = SOCIAL_MEDIA_OPTIONS.find(type => type.value === item.name);
          const hasError = errors && errors[index] && errors[index].username;
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
                  className="editable-input"
                  placeholder="Username"
                  value={item.username}
                  onBlur={() => this.handleBlur(index)}
                  onChange={event => this.handleChange(event.target.value, index, 'username')}
                />
              </div>

              <div className="w-30 m-l-10 m-r-10">
                <Select
                  name="status"
                  styles={SELECT_STYLES}
                  options={SOCIAL_MEDIA_OPTIONS}
                  value={{ value: item.name, label: socialType.label }}
                  onChange={selected => this.handleChange(selected.value, index, 'name')}
                  onInputKeyDown={this.onInputKeyDown}
                  menuPortalTarget={document.body}
                />
              </div>

              <div className="form-related-actions">
                <button
                  className="hl-primary-btn m-r-10"
                  onClick={() => this.toggleDelete(item, index)}
                  type="button"
                >
                  {item.isDeleted ? (
                    <FontAwesomeIcon icon={['far', 'undo']} />
                  ) : (
                    <FontAwesomeIcon icon={['far', 'trash-alt']} />
                  )}
                </button>

                {index === items.length - 1 && (
                  <button className="hl-primary-btn" onClick={this.addRow} type="button">
                    <FontAwesomeIcon icon={['far', 'plus']} />
                  </button>
                )}
              </div>

              {hasError && <div className="error-message">{errors[index].username}</div>}
            </div>
          );
        })}
      </React.Fragment>
    );
  }
}

export default SocialMediaField;
