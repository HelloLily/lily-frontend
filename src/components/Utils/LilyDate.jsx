import React from 'react';
import { format } from 'date-fns';

const LilyDate = props => {
  const { date } = props;
  const dateFormat = props.format || 'dd MMM. YYYY';

  return <span>{format(date, dateFormat)}</span>;
};

export default LilyDate;
