import { get, post, patch, del } from 'src/lib/api';

class EmailAccount {
  get PUBLIC() {
    return 0;
  }

  get READONLY() {
    return 1;
  }

  get METADATA() {
    return 2;
  }

  get PRIVATE() {
    return 3;
  }

  get(id) {
    return get(`/messaging/email/accounts/${id}/`);
  }

  post(data) {
    return post('/messaging/email/accounts/', data);
  }

  patch(data) {
    return patch(`/messaging/email/accounts/${data.id}/`, data);
  }

  del(id) {
    return del(`/messaging/email/accounts/${id}/`);
  }

  query(params) {
    return get('/messaging/email/accounts/', params);
  }

  mine() {
    return get('/messaging/email/accounts/mine');
  }

  setup() {
    return get('/messaging/email/accounts/setup');
  }

  exists() {
    return get('/messaging/email/accounts/exists/');
  }

  privacyOptions() {
    // Hardcoded because these are the only privacy options.
    return [
      {
        id: 0,
        name: 'Group inbox',
        text: 'Used by multiple people'
      },
      {
        id: 1,
        name: 'Public personal inbox',
        text: 'Colleagues can see my email'
      },
      {
        id: 2,
        name: 'Personal inbox, with shared metadata',
        text: 'The content of email is hidden, only meta data is visible'
      },
      {
        id: 3,
        name: 'Private inbox',
        text: 'Nothing is shared, you lose Lily superpowers'
      }
    ];
  }
}

export default new EmailAccount();
