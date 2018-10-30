import ucfirst from './ucfirst';

/**
 * Convert the given camelCased value to a human readable string.
 * @param {string} text: The text to convert.
 * @param {boolean} upperCaseFirst: Capitalize first letter or not.
 */
export default function camelToHuman(text, upperCaseFirst = false) {
  const replaced = text.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();

  if (upperCaseFirst) {
    return ucfirst(replaced);
  }

  return replaced;
}
