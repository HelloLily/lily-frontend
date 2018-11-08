import { get } from 'src/lib/api';

class Country {
  query() {
    return get('/utils/countries-new/');
  }
}

export default new Country();
