import { get, patch } from 'src/lib/api';

class Tenant {
  get() {
    return get(`/tenants/`);
  }

  patch(data) {
    return patch(`/tenants/${data.id}/`, data);
  }
}

export default new Tenant();
