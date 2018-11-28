import * as cache from '../cache';
import { cachePostResponseAsGet } from '../../config/api.json';
import { convertKey, convertKeys } from './utils';
import handleResponse from './handleResponse';
import setupRequestOptions from './setupRequestOptions';
import { DESCENDING_STATUS } from '../constants';

export function createParams(params = {}) {
  const { sortColumn, filters } = params;

  if (sortColumn) {
    const { sortStatus } = params;
    const convertedKey = convertKey(params.sortColumn, true);

    params.ordering = `${sortStatus === DESCENDING_STATUS ? '-' : ''}${convertedKey}`;

    delete params.sortColumn;
    delete params.sortStatus;
  }

  let filterQuery = '';

  if (filters && Object.keys(filters).length > 0) {
    filterQuery = Object.keys(filters).reduce((acc, key) => {
      filters[key].forEach(filter => {
        acc.push(convertKey(filter, true));
      });

      return acc;
    }, []);
  }

  delete params.filters;

  const convertedParams = convertKeys(params, true);

  let urlParams = Object.keys(convertedParams)
    .map(key => {
      const encodedKey = encodeURIComponent(key);
      const encodedParam = encodeURIComponent(convertedParams[key]);

      return `${encodedKey}=${encodedParam}`;
    })
    .join('&');

  if (filterQuery) urlParams += `&${filterQuery}`;

  return urlParams;
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

export function post(path, body, hasFiles = false) {
  const { uri, options } = setupRequestOptions(path, { body, method: 'POST' });

  if (hasFiles) {
    // Delete the Content-Type header so fetch can send files.
    delete options.headers['Content-Type'];
  }

  if (options.body && typeof options.body === 'object') {
    if (!hasFiles) {
      const data = convertKeys(options.body, true);
      options.body = JSON.stringify(data);
    }
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
