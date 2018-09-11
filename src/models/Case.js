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

  query() {
    const response = get('/cases/');

    return response;
  }

  caseTypes() {
    const response = get('/cases/types/');

    return response;
  }

  statuses() {
    const response = get('/cases/statuses/');

    return response;
  }

  priorities() {
    const response = get('/cases/priorities/');

    return response;
  }

  openCases(data) {
    return get('/cases/open', data);
  }
}

export default new Case();
