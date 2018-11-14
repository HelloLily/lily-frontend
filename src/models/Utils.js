import { get, post } from 'src/lib/api';

class Utils {
  countries() {
    return get('/utils/countries-new/');
  }

  currencies() {
    return get('/utils/currencies/');
  }

  import(data) {
    return post('/import/', data, true);
  }
}

export default new Utils();
