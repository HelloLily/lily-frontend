import { get, post } from 'lib/api';

class PandaDoc {
  events() {
    return get('/integrations/documents/events/');
  }

  saveEvents(data) {
    return post('/integrations/documents/events/', data);
  }

  sharedKey() {
    return get('/integrations/documents/events/shared-key/');
  }

  saveSharedKey(data) {
    return post('/integrations/documents/events/shared-key/', data);
  }

  documentEvents() {
    return [
      'document_state_changed',
      'recipient_completed',
      'document_updated',
      'document_deleted'
    ];
  }

  documentStatuses() {
    return [
      'document.uploaded',
      'document.draft',
      'document.sent',
      'document.viewed',
      'document.waiting_approval',
      'document.rejected',
      'document.approved',
      'document.waiting_pay',
      'document.paid',
      'document.completed',
      'document.voided'
    ];
  }
}

export default new PandaDoc();
