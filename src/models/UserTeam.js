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
    const response = get('/users/team', params);

    return response;
  }
}

export default new UserTeam();
