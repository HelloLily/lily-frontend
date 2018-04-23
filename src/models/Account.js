import { get, post, patch, del } from 'src/lib/api';

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

  query() {
    const response = get('/accounts/');

    return response;
  }
}

export default new Account();
