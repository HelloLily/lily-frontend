import React, { Component } from 'react';
import { format, isDate, isWeekend } from 'date-fns';
import DatePicker from 'react-datepicker';
import cx from 'classnames';

class LilyDatePicker extends Component {
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
    const { inline, date, submitting } = this.props;

    const dateObj = isDate(date) ? date : new Date(date);
    const className = cx({
      'input-addon': !inline,
      'is-disabled': submitting
    })

    return (
      <div className={className}>
        <DatePicker
          {...this.props}
          filterDate={day => !isWeekend(day)}
          inputProps={{
            className: 'hl-input',
            ref: this.datepicker
          }}
          onChange={this.props.onChange}
          placeholder={this.props.placeholder || 'Select a date'}
          formatDate={this.formatDate}
          selected={dateObj}
          className="hl-input"
        />

        {!inline && (
          <button className="hl-primary-btn" onClick={this.openDatepicker} type="button">
            <i className="lilicon hl-calendar-icon" />
          </button>
        )}
      </div>
    );
  }
}

export default LilyDatePicker;
