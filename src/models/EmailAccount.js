import { get, post, patch, del } from 'src/lib/api';

class EmailAccount {
  get(id) {
    return get(`/messaging/email/accounts/${id}/`);
  }

  post(data) {
    return post('/messaging/email/accounts/', data);
  }

  patch(data) {
    return patch(`/messaging/email/accounts/${data.id}/`, data);
  }

  del(id) {
    return del(`/messaging/email/accounts/${id}/`);
  }

  query() {
    const response = get('/messaging/email/accounts/');

    return response;
  }

  mine() {
    const response = get('/messaging/email/accounts/mine');

    return response;
  }
}

export default new EmailAccount();
