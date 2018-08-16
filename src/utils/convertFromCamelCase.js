export default function convertFromCamelCase(value) {
  // Convert camelCase to normal spaced word.
  let text = value.replace(/([A-Z])/g, ' $1').toLowerCase();
  // Uppercase the first letter.
  text = text.charAt(0).toUpperCase() + text.slice(1);

  return text;
}
