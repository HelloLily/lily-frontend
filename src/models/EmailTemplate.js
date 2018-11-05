import { get, post, patch, put } from 'src/lib/api';

class EmailTemplate {
  get(id) {
    return get(`/messaging/email/templates/${id}/`);
  }

  post(data) {
    return post('/messaging/email/templates/', data);
  }

  patch(data) {
    return patch(`/messaging/email/templates/${data.id}/`, data);
  }

  put(data) {
    return put(`/messaging/email/templates/${data.id}/`, data);
  }

  query(params) {
    return get('/messaging/email/templates/', params);
  }

  move(data) {
    return patch('/messaging/email/templates/move/', data);
  }
}

export default new EmailTemplate();
