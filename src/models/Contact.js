import { get, post, patch, del } from 'src/lib/api';

class Contact {
  get(id) {
    return get(`/contacts/${id}/`);
  }

  patch(data) {
    return patch(`/contacts/${data.id}/`, data);
  }

  query() {
    const response = get('/contacts/');

    return response;
  }
}

export default new Contact();
