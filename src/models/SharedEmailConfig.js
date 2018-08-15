import { get, post } from 'src/lib/api';

class SharedEmailConfig {
  get(id) {
    return get(`/messaging/email/shared-email-configurations/${id}`);
  }

  post(data) {
    return post('/messaging/email/shared-email-configurations/', data);
  }
}

export default new SharedEmailConfig();
