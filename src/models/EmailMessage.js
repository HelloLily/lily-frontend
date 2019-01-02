import { get, post, put, patch, del } from 'src/lib/api';
import {
  INBOX_LABEL,
  // SENT_LABEL,
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
    return post('/messaging/email/drafts/', data);
  }

  send(id) {
    return post(`/messaging/email/drafts/${id}/send/`);
  }

  patch(data) {
    return patch(`/messaging/email/drafts/${data.id}/`, data);
  }

  del(id) {
    return del(`/messaging/email/drafts/${id}/`);
  }

  query(params) {
    // TODO: Temporary until there's a proper email message API.
    // const filter = [];
    // const { emailAccount, label } = params;

    // if (label) {
    //   if (label.labelId === INBOX_LABEL) {
    //     filter.push('is_archived:false');
    //   }

    //   if (label.labelId !== TRASH_LABEL) {
    //     filter.push('is_trashed:false');
    //   } else {
    //     filter.push('(is_trashed:true OR is_deleted:false)');
    //   }

    //   if (label.labelId !== SPAM_LABEL) {
    //     filter.push('is_spam:false');
    //   } else {
    //     filter.push('is_spam:true');
    //   }

    //   if (label.labelId === DRAFT_LABEL) {
    //     filter.push('is_draft:true');
    //   }

    //   const isDefaultLabel = DEFAULT_LABELS.some(
    //     defaultLabel => defaultLabel.labelId === label.labelId
    //   );

    //   if (!isDefaultLabel) {
    //     filter.push(`label_id:${label.labelId}`);
    //   }
    // } else {
    //   // Corresponds with the 'All mail' label.
    //   filter.push('is_trashed:false');
    //   filter.push('is_spam:false');
    //   filter.push('is_draft:false');
    // }

    // if (emailAccount) {
    //   filter.push(`account.id:${emailAccount.id}`);
    // }

    // TODO: Temporary.
    return { results: [] };

    return get('/messaging/email/search/', params);
  }

  search(params) {
    // TODO: Temporary.
    return { results: [] };

    return get('/messaging/email/search/', params);
  }

  searchEmailAddress(emailAddress) {
    // TODO: Temporary until there's a proper email message API.
    const url = `/search/emailaddress/${emailAddress}?key=superuser1`;

    return get(url);
  }

  history(id) {
    const url = `/messaging/email/email/${id}/history/`;

    return get(url);
  }

  thread(id) {
    const url = `/messaging/email/email/${id}/thread/`;

    return get(url);
  }

  star(data) {
    const url = `/messaging/email/email/${data.id}/star/`;

    return patch(url, data);
  }

  archive(data) {
    const url = `/messaging/email/email/${data.id}/archive/`;

    return patch(url, data);
  }

  trash(id) {
    const url = `/messaging/email/email/${id}/trash/`;

    return put(url);
  }

  move(data) {
    const url = `/messaging/email/email/${data.id}/move/`;

    return patch(url, data);
  }

  extract(data) {
    const url = `/messaging/email/email/${data.id}/extract/`;

    return post(url, data);
  }

  attachments(id) {
    const url = `/messaging/email/email/${id}/attachments/`;

    return get(url);
  }

  presignedUrl(id, data) {
    const url = `/messaging/email/drafts/${id}/attachments/`;

    return post(url, data);
  }
}

export default new EmailMessage();
