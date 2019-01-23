export default function getColorCode(value) {
  let hash = 0;
  let color = '#';

  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }

  for (let i = 0; i < 3; i++) {
    const hashValue = (hash >> (i * 8)) & 0xff;
    color += `00${hashValue.toString(16)}`.substr(-2);
  }

  return color;
}
