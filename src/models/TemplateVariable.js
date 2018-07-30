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
    const response = get('/messaging/email/template-variables/');

    return response;
  }
}

export default new TemplateVariable();
