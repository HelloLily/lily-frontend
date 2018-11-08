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
    return get('/users/invites');
  }
}

export default new UserInvite();
