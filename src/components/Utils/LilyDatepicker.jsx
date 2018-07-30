import React from 'react';
import { format } from 'date-fns';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

const LilyDatepicker = props => {
  const { date } = props;
  const dateFormat = props.format || 'dd MMM. YYYY';

  return (
    <DayPickerInput
      dayPickerProps={{
        todayButton: 'Today'
      }}
      onDayChange={props.onChange}
      showOverlay
    />
  );
};

export default LilyDatepicker;
