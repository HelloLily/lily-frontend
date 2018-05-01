import { get, post, patch, del, createParams } from 'src/lib/api';

class Account {
  get(id) {
    return get(`/accounts/${id}/`);
  }

  post(data) {
    return post('/accounts/', data);
  }

  patch(data) {
    return patch(`/accounts/${data.id}/`, data);
  }

  del(id) {
    return del(`/accounts/${id}/`);
  }

  query(params) {
    const response = get(`/accounts/?${createParams(params)}`);

    return response;
  }
}

export default new Account();
