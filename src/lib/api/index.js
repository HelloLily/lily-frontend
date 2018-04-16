import * as cache from '../cache';
import { cachePostResponseAsGet } from '../../config/api.json';
import { handleResponse } from './handleResponse';
import { setupRequestOptions } from './setupRequestOptions';
import { convertKeys } from './utils';

export function get(path, _options) {
  const { uri, options } = setupRequestOptions(path, _options);

  if (cache.isCached(uri)) {
    return cache.get(uri);
  }

  const promise = fetch(uri, options).then(handleResponse);

  cache.add({ uri, promise });

  return promise;
}

export function post(path, body) {
  const { uri, options } = setupRequestOptions(path, { body, method: 'POST' });

  if (options.body && typeof options.body === 'object') {
    options.body = JSON.stringify(options.body);
  }

  const promise = fetch(uri, options).then(handleResponse);

  if (cachePostResponseAsGet.includes(path)) {
    cache.add({ uri, promise });
  }

  return promise;
}

export function put(path, body) {
  const { uri, options } = setupRequestOptions(path, { body, method: 'PUT' });

  if (options.body && typeof options.body === 'object') {
    const body = convertKeys(options.body, true);
    options.body = JSON.stringify(body);
  }

  return fetch(uri, options).then(handleResponse);
}

export function patch(path, body) {
  const { uri, options } = setupRequestOptions(path, { body, method: 'PATCH' });

  if (options.body && typeof options.body === 'object') {
    const body = convertKeys(options.body, true);
    console.log(body);
    options.body = JSON.stringify(body);
  }

  return fetch(uri, options).then(handleResponse);
}

export function del(path) {
  const { uri, options } = setupRequestOptions(path, { method: 'DELETE' });
  return fetch(uri, options).then(handleResponse);
}
