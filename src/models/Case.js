import { get, post, patch, del } from 'src/lib/api';

class Case {
  get(id) {
    return get(`/cases/${id}/`);
  }

  patch(data) {
    return patch(`/cases/${data.id}/`, data);
  }

  query() {
    const response = get('/cases/');

    return response;
  }
}

export default new Case();
