import { get } from 'src/lib/api';

class Country {
  query() {
    const response = get('/utils/countries-new/');

    return response;
  }
}

export default new Country();
