/**
 * Iterates over all values and calls the callback function if the value isn't empty.
 *
 * @param {Array} values - Array containing all values.
 * @param {function} callback - This function is called when a given value isn't empty.
 */
export default function setValues(values, callback) {
  Object.keys(values).forEach(key => {
    const data = values[key];
    let addData = true;

    if (!data) addData = false;
    else if (Array.isArray(data) && data.length === 0) addData = false;

    if (addData) {
      callback(key, data);
    }
  });
}
