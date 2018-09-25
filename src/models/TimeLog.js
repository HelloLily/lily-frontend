import { get, post, patch } from 'src/lib/api';

class TimeLog {
  get(id) {
    return get(`/timelogs/${id}/`);
  }

  post(data) {
    return post('/timelogs', data);
  }

  patch(data) {
    return patch(`/timelogs/${data.id}/`, data);
  }
}

export default new TimeLog();
