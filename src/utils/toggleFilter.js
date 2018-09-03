export default function toggleFilter(filters, filter) {
  const index = filters.findIndex(currentFilter => currentFilter === filter);

  if (index === -1) {
    // The given filter hasn't been selected, so add it.
    filters.push(filter);
  } else {
    // Otherwise remove it from the filter array.
    filters.splice(index, 1);
  }

  return filters;
}
