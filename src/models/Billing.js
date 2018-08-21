import { get, patch, post } from 'src/lib/api';

class Billing {
  get() {
    return get('/billing/subscription');
  }

  patch(data) {
    return patch('/billing/subscription', data);
  }

  plans() {
    return get('/billing/plans');
  }

  hostedPage(action) {
    return get(`/billing/${action}`);
  }

  invoice(id) {
    return post('/billing/download_invoice/', { invoiceId: id });
  }

  cancel() {
    return get('/billing/cancel');
  }
}

export default new Billing();
