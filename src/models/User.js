import { get, patch, post, del } from 'src/lib/api';

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

  query(params) {
    return get('/users/', params);
  }

  unassigned() {
    return get('/users/unassigned');
  }

  token() {
    return get('/users/token/');
  }

  generateToken() {
    return post('/users/token/');
  }

  deleteToken() {
    return del('/users/token/');
  }

  search(query) {
    return get(`/users/?search=${query}`);
  }
}

export default new User();
