import * as cache from '../cache';
import { cachePostResponseAsGet } from '../../config/api.json';
import convertKeys from './utils';
import handleResponse from './handleResponse';
import setupRequestOptions from './setupRequestOptions';

export function createParams(params = {}) {
  const convertedParams = convertKeys(params, true);

  return Object.keys(convertedParams)
    .map(key => {
      const encodedKey = encodeURIComponent(key);
      const encodedParam = encodeURIComponent(convertedParams[key]);

      return `${encodedKey}=${encodedParam}`;
    })
    .join('&');
}

export function get(path, params, _options) {
  const { uri, options } = setupRequestOptions(path, _options);

  // TODO: Temporary work around because email messages don't have a proper API yet.
  let url = uri.includes('search/') ? uri.replace('/api', '') : uri;

  if (params) {
    url += `&${createParams(params)}`;
  }

  // TODO: Implement proper caching. With the following code
  // different actions (e.g. GET after POST) results in the same data.
  // This leads to unexpected behaviour.
  // if (cache.isCached(url)) {
  //   return cache.get(url);
  // }

  const promise = fetch(url, options).then(handleResponse);

  cache.add({ uri, promise });

  return promise;
}

export function post(path, body) {
  const { uri, options } = setupRequestOptions(path, { body, method: 'POST' });

  if (options.body && typeof options.body === 'object') {
    const data = convertKeys(options.body, true);
    options.body = JSON.stringify(data);
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
    const data = convertKeys(options.body, true);
    options.body = JSON.stringify(data);
  }

  return fetch(uri, options).then(handleResponse);
}

export function patch(path, body) {
  const { uri, options } = setupRequestOptions(path, { body, method: 'PATCH' });

  if (options.body && typeof options.body === 'object') {
    const data = convertKeys(options.body, true);
    options.body = JSON.stringify(data);
  }

  return fetch(uri, options).then(handleResponse);
}

export function del(path) {
  const { uri, options } = setupRequestOptions(path, { method: 'DELETE' });
  return fetch(uri, options).then(handleResponse);
}
