/**
 * Convert the given object to a hash so it can be used as a key wherever needed.
 */
export default function hashCode(object) {
  const objectString = JSON.stringify(object);
  let hash = 0;

  for (let i = 0; i < objectString.length; i++) {
    const character = objectString.charCodeAt(i);
    hash = (hash << 5) - hash + character;
    hash &= hash; // Convert to 32bit integer
  }

  return hash;
}
