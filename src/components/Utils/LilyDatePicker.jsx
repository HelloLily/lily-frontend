import React, { Component } from 'react';
import { parse, isDate, isWeekend } from 'date-fns';
import DatePicker from 'react-datepicker';
import cx from 'classnames';

class LilyDatePicker extends Component {
  constructor(props) {
    super(props);

    this.datePicker = React.createRef();
    this.dateFormat = this.props.format || 'dd/MM/yyyy';
  }

  openDatePicker = () => {
    this.datePicker.current.setOpen(true);
  };

  render() {
    const { inline, date, submitting } = this.props;

    // DatePicker only accepts null as empty value (so no empty string).
    let dateObj = null;

    if (date) {
      // Only parse if there's an actual value.
      // Otherwise 'Invalid date' will be returned.
      dateObj = isDate(date) ? date : parse(date, this.dateFormat, new Date());
    }

    const className = cx({
      'input-addon': !inline,
      'is-disabled': submitting
    });

    return (
      <div className={className}>
        <DatePicker
          {...this.props}
          filterDate={day => !isWeekend(day)}
          onChange={this.props.onChange}
          placeholderText={this.props.placeholder || 'Select a date'}
          dateFormat={this.dateFormat}
          selected={dateObj || null}
          className="hl-input"
          ref={this.datePicker}
        />

        {!inline && (
          <button className="hl-primary-btn" onClick={this.openDatePicker} type="button">
            <i className="lilicon hl-calendar-icon" />
          </button>
        )}
      </div>
    );
  }
}

export default LilyDatePicker;
