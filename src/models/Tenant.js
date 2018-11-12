import { get, patch } from 'src/lib/api';

class Tenant {
  get() {
    return get(`/tenants/`);
  }

  patch(data) {
    return patch(`/tenants/${data.id}/`, data);
  }

  objectCounts() {
    return get(`/tenants/object_counts`);
  }

  isVoysNL(id) {
    return id === 50 || process.env.DEBUG;
  }

  isVoysZA(id) {
    return id === 52;
  }
}

export default new Tenant();
