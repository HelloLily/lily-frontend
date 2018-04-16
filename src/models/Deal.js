import { get, post, patch, del } from 'src/lib/api';

class Deal {
  get(id) {
    return get(`/deals/${id}/`);
  }

  patch(data) {
    return patch(`/deals/${data.id}/`, data);
  }

  query() {
    const response = get('/deals/');

    return response;
  }
}

export default new Deal();
