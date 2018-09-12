import { get } from 'src/lib/api';

class Call {
  get(id) {
    return get(`/call-records/${id}/`);
  }

  latestCall() {
    return get('/call-records/latest/');
  }
}

export default new Call();
