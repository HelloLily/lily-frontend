import { get, post, patch, del } from 'src/lib/api';

class Tag {
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

  query(query) {
    // TODO: Temporary until there's a proper tag API.
    const url = `/search/search/?type=tags_tag&facet_field=name_flat&facet_filter=name:${query}&size=60&key=superuser1`;

    return get(url);
  }
}

export default new Tag();
