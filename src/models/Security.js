import { get, post, del } from 'src/lib/api';

class Security {
  query() {
    return get('/users/two-factor/');
  }

  regenerateTokens() {
    return post('/users/two-factor/regenerate_tokens/');
  }

  disable() {
    return del('/users/two-factor/disable/');
  }

  removePhone() {
    return del('/users/two-factor/:id/remove_phone/');
  }

  sessions() {
    return get(`/users/sessions/`);
  }
}

export default new Security();
