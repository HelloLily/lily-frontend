import { base, defaultRequest } from 'src/config/api.json';

if (window && window.csrf) {
  defaultRequest.headers['X-csrftoken'] = window.csrf;
}

export default function setupRequestOptions(path, _options) {
  // TODO: Ugly hack for now to allow multiple query parameters.
  // TODO: Remove the key parameter.
  const key = `${path.includes('?') ? '&' : '?'}key=superuser1`;

  return {
    uri: `${base}${path.replace(base, '')}${key}`,
    options: Object.assign({}, defaultRequest, _options)
  };
}
