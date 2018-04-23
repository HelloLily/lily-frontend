import { get, post, patch, del } from 'src/lib/api';

class Deal {
  get(id) {
    return get(`/deals/${id}/`);
  }

  post(data) {
    return post('/deals/', data);
  }

  patch(data) {
    return patch(`/deals/${data.id}/`, data);
  }

  del(id) {
    return del(`/deals/${id}/`);
  }

  query() {
    const response = get('/deals/');

    return response;
  }
}

export default new Deal();
