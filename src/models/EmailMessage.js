import { get, post, put, patch, del } from 'src/lib/api';

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
    const url =
      '/search/search/?filterquery=&size=20&sort=-sent_date&type=email_emailmessage&user_email_related=1&key=superuser1';

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

  star(data) {
    const url = `/messaging/email/email/${data.id}/star/`;

    const response = patch(url, data);

    return response;
  }

  archive(data) {
    const url = `/messaging/email/email/${data.id}/archive/`;

    const response = patch(url, data);

    return response;
  }

  trash(data) {
    const url = `/messaging/email/email/${data.id}/trash/`;

    const response = put(url, data);

    return response;
  }

  move(data) {
    const url = `/messaging/email/email/${data.id}/move/`;

    const response = patch(url, data);

    return response;
  }

  extract(data) {
    const url = `/messaging/email/email/${data.id}/extract/`;

    const response = post(url, data);

    return response;
  }
}

export default new EmailMessage();
