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

  query() {
    const response = get('/deals/');

    return response;
  }

  statuses() {
    const response = get('/deals/statuses/');

    return response;
  }

  nextSteps() {
    const response = get('/deals/next-steps/');

    return response;
  }

  foundThrough() {
    const response = get('/deals/found-through/');

    return response;
  }

  contactedBy() {
    const response = get('/deals/contacted-by/');

    return response;
  }

  whyCustomer() {
    const response = get('/deals/why-customer/');

    return response;
  }

  whyLost() {
    const response = get('/deals/why-lost/');

    return response;
  }
}

export default new Deal();
