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
    const response = get('/cases/', params);

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

  // TODO: Temporary code. Actual search will be different.
  search(filterquery) {
    const url = `/search/search/?type=cases_case&filterquery=${filterquery}`;

    const response = get(url);

    return response;
  }

  exists() {
    const response = get('/cases/exists/');

    return response;
  }
}

export default new Case();
