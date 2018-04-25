import { get, patch } from 'src/lib/api';

class User {
  get(id) {
    return get(`/users/${id}/`);
  }

  patch(data) {
    return patch(`/users/${data.id}/`, data);
  }

  query() {
    const response = get('/users/');

    return response;
  }
}

export default new User();
