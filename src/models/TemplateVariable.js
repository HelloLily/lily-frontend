import { get, post, patch } from 'src/lib/api';

class TemplateVariable {
  get(id) {
    return get(`/messaging/email/template-variables/${id}/`);
  }

  post(data) {
    return post(`/messaging/email/template-variables/`, data);
  }

  patch(data) {
    return patch(`/messaging/email/template-variables/${data.id}/`, data);
  }

  query() {
    return get('/messaging/email/template-variables/');
  }
}

export default new TemplateVariable();
