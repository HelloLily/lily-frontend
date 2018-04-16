import { convertKeys } from './utils';

const successCodes = [200, 201, 202, 203, 204];

export async function handleResponse(response) {
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

  if (!successCodes.includes(status)) {
    data.status = status;
    const error = new Error(statusText);
    error.data = data;
    throw error;
  }

  data = convertKeys(data);

  return data;
}
