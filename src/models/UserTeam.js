import { get, post, patch } from 'src/lib/api';

class UserTeam {
  get(id) {
    return get(`/users/team/${id}/`);
  }

  post(data) {
    return post('/users/team/', data);
  }

  patch(data) {
    return patch(`/users/team/${data.id}/`, data);
  }

  query(params) {
    return get('/users/team', params);
  }
}

export default new UserTeam();
