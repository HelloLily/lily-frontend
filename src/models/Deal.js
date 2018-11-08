import { get, post, patch, del } from 'src/lib/api';

class Deal {
  get(id) {
    return get(`/deals/${id}/`);
  }

  post(data) {
    return post('/deals/', data);
  }

  patch(data) {
    return patch(`/deals/${data.id}/`, data);
  }

  del(id) {
    return del(`/deals/${id}/`);
  }

  query(params) {
    return get('/deals/', params);
  }

  statuses() {
    return get('/deals/statuses/');
  }

  nextSteps() {
    return get('/deals/next-steps/');
  }

  foundThrough() {
    return get('/deals/found-through/');
  }

  contactedBy() {
    return get('/deals/contacted-by/');
  }

  whyCustomer() {
    return get('/deals/why-customer/');
  }

  whyLost() {
    return get('/deals/why-lost/');
  }

  openDeals(data) {
    return get('/deals/open', data);
  }

  // TODO: Temporary code. Actual search will be different.
  search(filterquery) {
    const url = `/search/search/?type=deals_deal&filterquery=${filterquery}`;

    return get(url);
  }

  documents(id) {
    return get(`/integrations/documents/${id}`);
  }

  exists() {
    return get('/deals/exists/');
  }
}

export default new Deal();
