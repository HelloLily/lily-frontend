import history from 'utils/history';

import { convertKeys } from './utils';

const successCodes = [200, 201, 202, 203, 204];

export default async function handleResponse(response) {
  const { status, statusText } = response;

  let data;

  if (status === 204) {
    data = {};
  } else {
    data = await response.json().catch(err => {
      // eslint-disable-next-line
      console.error(err);
      return {};
    });
  }

  data = convertKeys(data);

  if (!successCodes.includes(status)) {
    data.statusCode = status;

    if (status === 403 && window.location.pathname !== '/') {
      // Just redirect back to the dashboard if the user isn't allowed to view the page.
      window.location = '/';
    }

    // Show a 404 if the page that's being viewed doesn't exists.
    if (status === 404 && response.url.includes(window.location.pathname)) {
      history.replace('/404');
    }

    const error = new Error(statusText);
    error.data = data;
    throw error;
  }

  return data;
}
