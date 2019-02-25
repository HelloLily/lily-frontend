import { post } from 'lib/api';

class Moneybird {
  setupSync(data) {
    return post('/integrations/moneybird/import/', data);
  }
}

export default new Moneybird();
