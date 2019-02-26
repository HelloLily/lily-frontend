export default function updateArray(items, value, index, field) {
  return items.map((item, arrIndex) => (index === arrIndex ? { ...item, [field]: value } : item));
}
