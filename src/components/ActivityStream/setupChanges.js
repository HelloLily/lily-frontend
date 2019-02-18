import { isWithinInterval, addHours, isValid, format } from 'date-fns';

import { HOURS_BETWEEN_CHANGES } from 'lib/constants';
import convertFromCamelCase from 'utils/convertFromCamelCase';
import ucfirst from 'utils/ucfirst';

const CHANGE_LOG_MAPPING = {
  phoneNumbers: 'number',
  emailAddresses: 'emailAddress',
  websites: 'website',
  assignedToTeams: 'name',
  tags: 'name',
  socialMedia: 'username',
  linkedin: 'username',
  twitter: 'username',
  accounts: 'name',
  functions: 'accountName'
};

const DISPLAY_NAME_MAPPING = {
  assignedToTeams: 'Teams',
  accounts: 'Works at',
  functions: 'Works at',
  expires: 'Expiry date'
};

const DATE_FORMAT = 'dd MMM. yyyy';

function getValueRelated(field) {
  // Since every model has a different field which contains the value
  // we set up a mapping and retrieve the proper field.
  return CHANGE_LOG_MAPPING[field];
}

function getChangeDisplayName(field, capitalize = false) {
  // For certain fields we don't want to show the field as it's named in the database.
  // So we set up a mapping and retrieve a nicer name.
  // Also cleans up underscores for all other fields.
  let displayName;

  if (DISPLAY_NAME_MAPPING.hasOwnProperty(field)) {
    displayName = DISPLAY_NAME_MAPPING[field];
  } else {
    displayName = convertFromCamelCase(field);

    if (capitalize) {
      displayName = ucfirst(displayName);
    }
  }

  return displayName;
}

export default function setupChanges(items, mergeChanges = true) {
  const filtered = items.filter(item => item.action !== 'post');
  const processedChanges = [];
  let changes = [];

  if (mergeChanges) {
    let previousTime;
    let futureTime;

    // Merge individual changes to a single change if they're within a certain time period.
    filtered.forEach((change, index) => {
      const currentTime = new Date(change.created);
      let addNewChange = false;

      if (index) {
        const previousChange = changes[changes.length - 1];

        if (previousChange.user.id === change.user.id) {
          const isBetween = isWithinInterval(currentTime, { start: previousTime, end: futureTime });

          if (isBetween) {
            change.data = Object.assign(previousChange.data, change.data);
            // Data was merged, so remove the previous entry and add the edited change.
            changes.pop();
          } else {
            addNewChange = true;
          }
        } else {
          addNewChange = true;
        }
      } else {
        addNewChange = true;
      }

      changes.push(change);

      if (addNewChange) {
        previousTime = currentTime;
        futureTime = addHours(currentTime, HOURS_BETWEEN_CHANGES);
      }
    });
  } else {
    changes = filtered;
  }

  changes.forEach(change => {
    // Normal fields with a single change.
    change.normal = {};
    // Fields which can contain multiple values (e.g. phone numbers).
    change.related = {};
    // Store all changed keys.
    change.changedKeys = [];

    Object.keys(change.data).forEach(key => {
      if (Array.isArray(change.data[key].new)) {
        change.related[key] = [];

        const oldData = change.data[key].old;
        const newData = change.data[key].new;

        newData.forEach(newItem => {
          let changeItem = {};
          let oldItem;

          const field = getValueRelated(key);
          const found = oldData.some(oldDataItem => {
            oldItem = oldDataItem;

            return oldItem.hasOwnProperty('id') && oldItem.id === newItem.id;
          });

          if (found) {
            // Old item exists, but new item is deleted.
            if (newItem.hasOwnProperty('isDeleted')) {
              changeItem = {
                old: oldItem[field] || oldItem,
                new: null
              };
            } else {
              // Both old and new item exist, so it's an edit.
              changeItem = {
                old: oldItem[field] || oldItem,
                new: newItem[field] || newItem
              };
            }
          } else {
            // No old item, so it's an addition.
            changeItem = {
              old: null,
              new: newItem[field] || newItem
            };
          }

          const displayName = getChangeDisplayName(key, true);

          change.related[key].push(changeItem);
          change.related[key].displayName = displayName;

          if (!change.changedKeys.includes(displayName)) {
            change.changedKeys.push(displayName);
          }
        });
      } else {
        const data = change.data[key];
        // Check if old and new data is empty.
        const oldDataEmpty = data.old === undefined || data.old === '' || data.old === null;
        const newDataEmpty = data.new === undefined || data.new === '' || data.new === null;

        // Use the boolean values to determine the state of the change item.
        if (!oldDataEmpty && !newDataEmpty) {
          // Both old and new have values, so it's an edit.
          data.changeType = 'edit';
        } else if (!oldDataEmpty && newDataEmpty) {
          // Old data exists, but no new data so it's a delete.
          data.changeType = 'delete';
        } else {
          // Otherwise it's an addition.
          data.changeType = 'add';
        }

        if (!oldDataEmpty) {
          const oldDate = new Date(data.old.toString());

          if (isValid(oldDate)) {
            // Dealing with a date here, so convert to a more readable format.
            data.old = format(oldDate, DATE_FORMAT);
          }
        }

        if (!newDataEmpty) {
          const newDate = new Date(data.new.toString());

          if (isValid(newDate)) {
            // Dealing with a date here, so convert to a more readable format.
            data.new = format(newDate, DATE_FORMAT);
          }
        }

        const displayName = getChangeDisplayName(key);

        change.normal[key] = data;
        change.normal[key].displayName = getChangeDisplayName(key);

        if (!change.changedKeys.includes(displayName)) {
          change.changedKeys.push(displayName);
        }
      }
    });

    // The data was put in other keys, so just remove the data key.
    delete change.data;

    change.relatedCount = Object.keys(change.related).length;

    processedChanges.push(change);
  });

  return processedChanges;
}
