import { get, post, patch, del } from 'lib/api';

class Account {
  get(id, params) {
    return get(`/accounts/${id}/`, params);
  }

  post(data) {
    return post('/accounts/', data);
  }

  patch(data) {
    return patch(`/accounts/${data.id}/`, data);
  }

  del(id) {
    return del(`/accounts/${id}/`);
  }

  query(params) {
    return get('/accounts/', params);
  }

  statuses() {
    return get('/accounts/statuses/');
  }

  dataproviderInfo(type, value) {
    const uri = `/provide/dataprovider/${type}/`;
    const data = {
      [type]: value
    };

    return post(uri, data);
  }

  exists() {
    return get('/accounts/exists/');
  }

  export(params) {
    return get('/accounts/export', params);
  }

  search(query) {
    return get(`/accounts/?search=${query}`);
  }
}

export default new Account();
