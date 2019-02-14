import { get, post, patch, put, del } from 'src/lib/api';

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

  put(data) {
    return put(`/cases/${data.id}/`, data);
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

  openCases(params) {
    return get('/cases/open', params);
  }

  exists() {
    return get('/cases/exists/');
  }

  search(query) {
    return get(`/cases/?search=${query}`);
  }
}

export default new Case();
