import { get, post, patch } from 'src/lib/api';

class Integration {
  get(type) {
    return get(`/integrations/details/${type}/`);
  }

  auth(type, data) {
    return post(`/integrations/auth/${type}/`, data);
  }

  patch(type, data) {
    return patch(`/integrations/${type}/${data.id}/`, data);
  }
}

export default new Integration();
