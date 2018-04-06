import isPromise from '../utils/isPromise';
import { minute } from '../utils/time';

const cache = {};
const cacheTTL = minute;

export function clear(uri = '') {
  delete cache[uri];
}

export function add({ uri, promise }) {
  cache[uri] = {
    promise,
    timestamp: new Date().getTime() + cacheTTL
  };
}

export function isCached(uri) {
  const cached = cache[uri];
  if (cached) {
    if (cached.timestamp > new Date().getTime() && isPromise(cached.promise)) {
      return true;
    }

    delete cache[uri];
  }
  return false;
}

export function get(uri) {
  return cache[uri] && cache[uri].promise;
}
