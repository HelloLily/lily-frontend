import { get, post, patch, del } from 'src/lib/api';

class Account {
  get(id) {
    return get(`/accounts/${id}/`);
  }

  patch(data) {
    return patch(`/accounts/${data.id}/`, data);
  }

  query() {
    const response = get('/accounts/');

    return response;
  }
}

export default new Account();
