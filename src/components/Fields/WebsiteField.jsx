import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import { WEBSITE_EMPTY_ROW } from 'lib/constants';

class WebsiteField extends Component {
  componentDidMount() {
    if (this.props.items.length === 0) {
      this.addRow();
    }
  }

  handleChange = (value, index, field) => {
    const { items } = this.props;

    items[index][field] = value;

    this.handleRelated(items);
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
    const { items, inline } = this.props;

    return (
      <React.Fragment>
        {items.map((item, index) => {
          // const hasError = error && error[index] && error[index].emailAddress;
          const rowClassName = cx('editable-related-row', {
            'is-deleted': item.isDeleted
            // 'has-error': hasError
          });

          return (
            <div className={rowClassName} key={item.id || `row-${index}`}>
              <input
                type="text"
                value={item.website}
                onChange={event => this.handleChange(event.target.value, index, 'website')}
                className="hl-input m-r-10"
                placeholder="Website"
              />

              <div className="form-related-actions">
                <button
                  className="hl-primary-btn m-r-10"
                  onClick={() => this.toggleDelete(item, index)}
                >
                  {item.isDeleted ? (
                    <FontAwesomeIcon icon="undo" />
                  ) : (
                    <i className="lilicon hl-trashcan-icon" />
                  )}
                </button>

                {!inline &&
                  index === items.length - 1 && (
                    <button className="hl-primary-btn" onClick={this.addRow}>
                      <FontAwesomeIcon icon="plus" />
                    </button>
                  )}
              </div>

              {/* {error &&
                error[index].emailAddress && (
                  <div className="error-message">{error[index].emailAddress}</div>
                )} */}
            </div>
          );
        })}
      </React.Fragment>
    );
  }
}

export default WebsiteField;
