import React, { Component } from 'react';
import { format } from 'date-fns';
import DayPickerInput from 'react-day-picker/DayPickerInput';

class LilyDatepicker extends Component {
  constructor(props) {
    super(props);

    this.datepicker = React.createRef();
    this.dateFormat = this.props.format || 'dd/MM/yyyy';
  }

  openDatepicker = () => {
    this.datepicker.current.focus();
  };

  formatDate = dateObject => format(dateObject, this.dateFormat);

  render() {
    return (
      <div className="input-addon">
        <DayPickerInput
          inputProps={{
            className: 'hl-input',
            ref: this.datepicker
          }}
          dayPickerProps={{
            todayButton: 'Today',
            showOutsideDays: true
          }}
          onDayChange={this.props.onChange}
          placeholder={this.props.placeholder || 'Select a date'}
          formatDate={this.formatDate}
          value={this.props.date}
        />

        <button className="hl-primary-btn" onClick={this.openDatepicker} type="button">
          <i className="lilicon hl-calendar-icon" />
        </button>
      </div>
    );
  }
}

export default LilyDatepicker;
