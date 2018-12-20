import jscookie from 'js-cookie';

import { defaultRequest } from 'src/config/api.json';

export default function setupRequestOptions(path, options) {
  if (options && options.hasOwnProperty('method')) {
    // Set the CSRF token for non GET requests.
    defaultRequest.headers['X-CSRFToken'] = jscookie.get('csrftoken');
  }

  const uri = `${process.env.BASE_URL}api${path}`;

  return {
    uri,
    options: Object.assign({}, defaultRequest, options)
  };
}
