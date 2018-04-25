import { addDays, isBefore, isSameDay } from 'date-fns';

/**
 *  Sorts the given items into multiple arrays based on the parsed time.
 *
 * @param {*} data Array containing the items to categorize.
 * @param {*} field The field which should be parsed.
 * @param {*} user The user to check for newly assigned items.
 */
const timeCategorize = (data, field, user) => {
  const now = new Date();
  const tomorrow = addDays(now, 1);

  const items = {
    newlyAssigned: [],
    expired: [],
    today: [],
    tomorrow: [],
    later: []
  };

  data.forEach(item => {
    if (item[field]) {
      const day = new Date(item[field]);

      if (item.newlyAssigned && (item.assignedTo && item.assignedTo.id === user.id)) {
        // Newly assigned item, so it's a special case.
        items.newlyAssigned.push(item);
      } else if (isBefore(day, now)) {
        // Parsed date is before the current date, so mark it as 'Expired'.
        items.expired.push(item);
      } else if (isSameDay(now, day)) {
        // Parsed date is the same as the current date, so mark it as 'Today'.
        items.today.push(item);
      } else if (isSameDay(tomorrow, day)) {
        // Parsed date is the same as tomorrow's date, so mark it as 'Tomorrow'.
        items.tomorrow.push(item);
      } else {
        // None of the above applies, so mark it as 'Later'.
        items.later.push(item);
      }
    } else {
      // No date was set, so mark it as 'Later'.
      items.later.push(item);
    }
  });

  return items;
};

export default timeCategorize;
