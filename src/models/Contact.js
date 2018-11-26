import { get, post, patch, del } from 'src/lib/api';

class Contact {
  get(id, params) {
    return get(`/contacts/${id}/`, params);
  }

  post(data) {
    return post('/contacts/', data);
  }

  patch(data) {
    return patch(`/contacts/${data.id}/`, data);
  }

  del(id) {
    return del(`/contacts/${id}/`);
  }

  query(params) {
    return get('/contacts/', params);
  }

  search(query) {
    const url = get(`/contacts/?search=${query}`);

    return get(url);
  }

  exists() {
    return get('/contacts/exists/');
  }

  export(params) {
    return get('/contacts/export', params);
  }
}

export default new Contact();
