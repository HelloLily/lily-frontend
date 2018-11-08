import { get } from 'src/lib/api';

class Utils {
  countries() {
    return get('/utils/countries-new/');
  }

  currencies() {
    return get('/utils/currencies/');
  }
}

export default new Utils();
