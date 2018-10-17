import React from 'react';
import { isDate, format } from 'date-fns';

const LilyDate = props => {
  const getFormat = () => {
    let dateFormat = 'dd MMM. yyyy';

    if (props.includeTime) {
      dateFormat = 'dd MMM. yyyy HH:mm';

      if (props.includeSeconds) {
        dateFormat = 'dd MMM. yyyy HH:mm:ss';
      }
    }

    return dateFormat;
  };

  const date = isDate(props.date) ? props.date : new Date(props.date);
  // Use the given date format if it exists.
  // Otherwise check if the time should be included.
  const dateFormat = props.format || getFormat();

  return <span className="lily-date">{format(date, dateFormat)}</span>;
};

export default LilyDate;
