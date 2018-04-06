import { base, defaultRequest } from 'app/config/api.json';

if (window && window.csrf) {
  defaultRequest.headers['X-csrftoken'] = window.csrf;
}

export function setupRequestOptions(path, _options) {
  return {
    uri: `${base}${path.replace(base, '')}`,
    options: Object.assign({}, defaultRequest, _options)
  };
}
