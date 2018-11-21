import { get, post, patch, del } from 'src/lib/api';

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

  searchByEmailAddress(emailAddress) {
    return get(`/search/emailaddress/${emailAddress}`);
  }

  searchByPhoneNumber(phoneNumber) {
    return get(`/search/number/${phoneNumber}`);
  }

  searchByWebsite(website) {
    return get(`/search/website/${website}`);
  }

  // TODO: Temporary code. Actual search will be different.
  search(filterquery) {
    const url = `/search/search/?type=accounts_account&filterquery=${filterquery}`;

    return get(url);
  }

  exists() {
    return get('/accounts/exists/');
  }

  export(params) {
    return get('/accounts/export', params);
  }
}

export default new Account();
