import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import { WEBSITE_EMPTY_ROW } from 'lib/constants';
import updateArray from 'utils/updateArray';

class WebsiteField extends Component {
  componentDidMount() {
    if (this.props.items.length === 0) this.addRow();
  }

  handleChange = (value, index, field) => {
    const { items } = this.props;

    const newItems = updateArray(items, value, index, field);

    this.handleRelated(newItems);
  };

  handleRelated = items => {
    this.props.handleRelated('websites', items);
  };

  addRow = () => {
    const { items } = this.props;
    const newRow = Object.assign({}, WEBSITE_EMPTY_ROW);

    this.handleRelated([...items, newRow]);
  };

  toggleDelete = (item, index) => {
    this.handleChange(!item.isDeleted, index, 'isDeleted');
  };

  render() {
    const { items, errors } = this.props;

    return (
      <React.Fragment>
        {items.map((item, index) => {
          const hasError = errors && errors[index] && errors[index].website;
          const rowClassName = cx('editable-related-row', {
            'is-deleted': item.isDeleted,
            'has-error': hasError
          });

          return (
            <div className={rowClassName} key={item.id || `row-${index}`}>
              <input
                type="text"
                value={item.website}
                onChange={event => this.handleChange(event.target.value, index, 'website')}
                className="editable-input m-r-10"
                placeholder="Website"
              />

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

              {hasError && <div className="error-message">{errors[index].website}</div>}
            </div>
          );
        })}
      </React.Fragment>
    );
  }
}

export default WebsiteField;
