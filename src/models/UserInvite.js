import { get, post, del } from 'src/lib/api';

class UserInvite {
  get(id) {
    return get(`/users/invites/${id}/`);
  }

  post(data) {
    return post(`/users/invites/`, data);
  }

  del(id) {
    return del(`/users/invites/${id}`);
  }

  query() {
    const response = get('/users/invites');

    return response;
  }
}

export default new UserInvite();
