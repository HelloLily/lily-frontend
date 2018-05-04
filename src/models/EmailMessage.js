import { get, post, patch, del } from 'src/lib/api';

class EmailMessage {
  get(id) {
    return get(`/messaging/email/email/${id}/`);
  }

  post(data) {
    return post('/messaging/email/email/', data);
  }

  patch(data) {
    return patch(`/messaging/email/email/${data.id}/`, data);
  }

  del(id) {
    return del(`/messaging/email/email/${id}/`);
  }

  query() {
    // TODO: Temporary until there's a proper email message API.
    const url = '/search/search/?filterquery=&size=20&sort=-sent_date&type=email_emailmessage&user_email_related=1&key=superuser1';

    const response = get(url);

    return response;
  }

  searchEmailAddress(emailAddress) {
    // TODO: Temporary until there's a proper email message API.
    const url = `/search/emailaddress/${emailAddress}?key=superuser1`;

    const response = get(url);

    return response;
  }

  history(id) {
    const url = `/messaging/email/email/${id}/history/`;

    const response = get(url);

    return response;
  }

  thread(id) {
    const url = `/messaging/email/email/${id}/thread/`;

    const response = get(url);

    return response;
  }
}

export default new EmailMessage();
