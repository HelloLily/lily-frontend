import { get, post, patch } from 'src/lib/api';

class EmailTemplateFolder {
  get(id) {
    return get(`/messaging/email/folders/${id}/`);
  }

  post(data) {
    return post(`/messaging/email/folders/`, data);
  }

  patch(data) {
    return patch(`/messaging/email/folders/${data.id}/`, data);
  }

  query() {
    return get('/messaging/email/folders/');
  }
}

export default new EmailTemplateFolder();
