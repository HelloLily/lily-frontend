import React, { Component } from 'react';

class RadioButton extends Component {
  constructor(props) {
    super(props);

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
      <div className="radio-buttons">
        {options.map((option, index) => (
          <label className="radio-button" key={option} htmlFor={`radio-${index}`}>
            <input
              type="radio"
              id={`radio-${index}`}
              checked={selected === index}
              onChange={() => this.setSelection(index)}
            />

            {option}
          </label>
        ))}
      </div>
    );
  }
}

export default RadioButton;
