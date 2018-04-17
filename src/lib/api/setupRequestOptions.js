import { base, defaultRequest } from 'src/config/api.json';

if (window && window.csrf) {
  defaultRequest.headers['X-csrftoken'] = window.csrf;
}

export function setupRequestOptions(path, _options) {
  return {
    uri: `${base}${path.replace(base, '')}?key=88582e527f7fab9a70aa647cb12bf1936a6da321`,
    options: Object.assign({}, defaultRequest, _options)
  };
}
