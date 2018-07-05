import React, { Component } from 'react';

class RadioButton extends Component {
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
    const { options } = this.props;

    return (
      <div className="radio-button-group">
        {options.map((option, index) => {
          const isSelected = selected === index;
          const radioId = `radio-${this.fieldId}-${index}`;

          return (
            <label
              className={`radio-button${isSelected ? ' active' : ''}`}
              key={option}
              htmlFor={radioId}
            >
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

export default RadioButton;
