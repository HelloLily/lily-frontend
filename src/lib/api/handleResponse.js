import convertKeys from './utils';

const successCodes = [200, 201, 202, 203, 204];

export default async function handleResponse(response) {
  const { status, statusText } = response;

  let data;

  if (status === 204) {
    data = {};
  } else {
    data = await response.json().catch(err => {
      console.error(err);
      return {};
    });
  }

  data = convertKeys(data);

  if (!successCodes.includes(status)) {
    data.statusCode = status;

    if (status === 403) {
      // Just redirect back to the dashboard if the user isn't allowed to view the page.
      window.location = '/';
    }

    const error = new Error(statusText);
    error.data = data;
    throw error;
  }

  return data;
}
