import { getDay, addDays } from 'date-fns';

export default function addBusinessDays(daysToAdd, date = null) {
  let dateObj = date ? new Date(date) : new Date();

  let i = 0;

  while (i < daysToAdd) {
    // Keep adding days based on the given amount while skipping Saturday and Sunday.
    dateObj = addDays(dateObj, 1);

    if (getDay(dateObj) !== 0 && getDay(dateObj) !== 6) {
      i += 1;
    }
  }

  return dateObj;
}
