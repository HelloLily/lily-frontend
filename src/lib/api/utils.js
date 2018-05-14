function convertKey(key, toSnakeCase) {
  let convertedKey = key;

  if (toSnakeCase) {
    // Since the back end uses snake_case, we also want to convert fields back when sending data.
    convertedKey = convertedKey.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
  } else {
    const splitKey = key.split('_');
    [convertedKey] = splitKey;

    // Convert to camelCase.
    if (splitKey.length > 1) {
      for (let i = 1; i < splitKey.length; i++) {
        convertedKey += splitKey[i].charAt(0).toUpperCase() + splitKey[i].slice(1);
      }
    }
  }

  return convertedKey;
}

/**
 * Converts keys from the API's data from snake_case to camelCase (or vice-versa).
 * This is so the front end can have it's own code style rules.
 */
export default function convertKeys(values, toSnakeCase = false) {
  let data = null;

  if (Array.isArray(values)) {
    data = values.slice();
  } else {
    data = Object.assign({}, values);
  }

  Object.keys(data).forEach(key => {
    const convertedKey = convertKey(key, toSnakeCase);

    if (convertedKey !== key) {
      data[convertedKey] = data[key];
      // Delete the old key since we don't want pollute our data with unused keys.
      delete data[key];
    }

    if (data[convertedKey] !== null && typeof data[convertedKey] === 'object') {
      data[convertedKey] = convertKeys(data[convertedKey], toSnakeCase);
    }
  });

  return data;
}
