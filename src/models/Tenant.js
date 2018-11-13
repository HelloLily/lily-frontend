import { get, patch } from 'src/lib/api';

class Tenant {
  get() {
    return get(`/tenants/`);
  }

  patch(data) {
    return patch(`/tenants/${data.id}/`, data);
  }

  info() {
    return get(`/tenants/info`);
  }

  isVoysNL(id) {
    return id === 50 || process.env.DEBUG;
  }

  isVoysZA(id) {
    return id === 52;
  }
}

export default new Tenant();
