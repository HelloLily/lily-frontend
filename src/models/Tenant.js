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
}

export default new Tenant();
