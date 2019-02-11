import { get } from 'src/lib/api';

class Call {
  get(id) {
    return get(`/call-records/${id}/`);
  }

  query(params) {
    return get('/call-records/', params);
  }

  latestCall() {
    return get('/call-records/latest/');
  }
}

export default new Call();
