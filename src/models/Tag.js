import { get } from 'src/lib/api';

class Tag {
  get(id) {
    return get(`/tags/${id}/`);
  }

  query(params) {
    return get('/tags/', params);
  }
}

export default new Tag();
