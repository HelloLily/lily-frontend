import { get, patch } from 'src/lib/api';

class EmailTemplate {
  get(id) {
    return get(`/messaging/email/templates/${id}/`);
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
