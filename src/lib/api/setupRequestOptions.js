import jscookie from 'js-cookie';

import { base, defaultRequest } from 'src/config/api.json';

export default function setupRequestOptions(path, options) {
  if (options && options.hasOwnProperty('method')) {
    // Set the CSRF token for non GET requests.
    defaultRequest.headers['X-CSRFToken'] = jscookie.get('csrftoken');
  }

  return {
    uri: `${base}${path.replace(base, '')}`,
    options: Object.assign({}, defaultRequest, options)
  };
}
