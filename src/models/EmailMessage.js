import { get, post, put, patch, del } from 'src/lib/api';
import {
  INBOX_LABEL,
  SENT_LABEL,
  TRASH_LABEL,
  SPAM_LABEL,
  DRAFT_LABEL,
  DEFAULT_LABELS
} from 'lib/constants';

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

  query(params) {
    // TODO: Temporary until there's a proper email message API.
    const filter = [];
    const { emailAccount, label } = params;

    if (label) {
      if (label.labelId === INBOX_LABEL) {
        filter.push('is_archived:false');
      }

      if (label.labelId !== TRASH_LABEL) {
        filter.push('is_trashed:false');
      } else {
        filter.push('(is_trashed:true OR is_deleted:false)');
      }

      if (label.labelId !== SPAM_LABEL) {
        filter.push('is_spam:false');
      } else {
        filter.push('is_spam:true');
      }

      if (label.labelId === DRAFT_LABEL) {
        filter.push('is_draft:true');
      }

      const isDefaultLabel = DEFAULT_LABELS.some(
        defaultLabel => defaultLabel.labelId === label.labelId
      );

      if (!isDefaultLabel) {
        filter.push(`label_id:${label.labelId}`);
      }
    } else {
      // Corresponds with the 'All mail' label.
      filter.push('is_trashed:false');
      filter.push('is_spam:false');
      filter.push('is_draft:false');
    }

    if (emailAccount) {
      filter.push(`account.id:${emailAccount.id}`);
    }

    const filterQuery = filter.join(' AND ');

    const url = `/search/search/?filterquery=${filterQuery}&size=20&sort=-sent_date&type=email_emailmessage&user_email_related=1&key=superuser1`;

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

  trash(id) {
    const url = `/messaging/email/email/${id}/trash/`;

    const response = put(url);

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
