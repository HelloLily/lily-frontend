import { get, post, patch } from 'src/lib/api';

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

  query() {
    const response = get('/messaging/email/templates/');

    return response;
  }
}

export default new EmailTemplate();
