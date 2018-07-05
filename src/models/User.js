import { get, patch } from 'src/lib/api';

class User {
  get(id) {
    return get(`/users/${id}/`);
  }

  me() {
    return get(`/users/me/`);
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
