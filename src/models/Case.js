import { get, post, patch, del } from 'src/lib/api';

class Case {
  get LOW_PRIORITY() {
    return 0;
  }

  get MEDIUM_PRIORITY() {
    return 1;
  }

  get HIGH_PRIORITY() {
    return 2;
  }

  get CRITICAL_PRIORITY() {
    return 3;
  }

  get(id) {
    return get(`/cases/${id}/`);
  }

  post(data) {
    return post('/cases/', data);
  }

  patch(data) {
    return patch(`/cases/${data.id}/`, data);
  }

  del(id) {
    return del(`/cases/${id}/`);
  }

  query(params) {
    return get('/cases/', params);
  }

  caseTypes() {
    return get('/cases/types/');
  }

  statuses() {
    return get('/cases/statuses/');
  }

  priorities() {
    return get('/cases/priorities/');
  }

  openCases(data) {
    return get('/cases/open', data);
  }

  exists() {
    return get('/cases/exists/');
  }
}

export default new Case();
