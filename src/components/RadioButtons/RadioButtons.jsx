import React, { Component } from 'react';
import cx from 'classnames';

class RadioButtons extends Component {
  constructor(props) {
    super(props);

    // Generate a random number so we can differentiate between radio button groups.
    this.fieldId = Math.floor(Math.random() * 1000 + 1);

    this.state = { selected: 0 };
  }

  setSelection = value => {
    this.setState({ selected: value });
    this.props.setSelection(value);
  };

  render() {
    const { selected } = this.state;
    const { options, vertical } = this.props;

    return (
      <div className="radio-button-group">
        {options.map((option, index) => {
          const isSelected = selected === index;
          const radioId = `radio-${this.fieldId}-${index}`;
          const className = cx('radio-button', {
            active: isSelected,
            vertical: vertical
          });

          return (
            <label className={className} key={option} htmlFor={radioId}>
              <input
                type="radio"
                id={radioId}
                className="radio-button-input"
                checked={isSelected}
                onChange={() => this.setSelection(index)}
              />

              <span className="radio-button-label">
                {isSelected && <span className="radio-button-checkmark" />}

                {option}
              </span>
            </label>
          );
        })}
      </div>
    );
  }
}

export default RadioButtons;
