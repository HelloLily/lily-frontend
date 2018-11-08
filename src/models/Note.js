import { get, post, patch, del } from 'src/lib/api';

class Note {
  get(id) {
    return get(`/notes/${id}/`);
  }

  post(data) {
    return post('/notes/', data);
  }

  patch(data) {
    return patch(`/notes/${data.id}/`, data);
  }

  del(id) {
    return del(`/notes/${id}/`);
  }

  query(params) {
    return get('/notes/', params);
  }
}

export default new Note();
