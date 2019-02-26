import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { successToast, errorToast } from 'utils/toasts';
import StreamCall from 'components/ActivityStream/StreamCall';
import LoadingIndicator from 'components/Utils/LoadingIndicator';
import Note from 'models/Note';
import Call from 'models/Call';

import 'components/ActivityStream/activity_stream.scss';
import 'style/call_logs.scss';

export default function CallLog() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [t] = useTranslation('toasts');

  async function getCalls() {
    const callResponse = await Call.query({ ordering: '-start' });
    const ids = callResponse.results.map(call => call.id);
    const params = {
      contentType: 'callrecord',
      objectId__in: ids
    };
    const response = await Note.query(params);
    const notes = response.results;
    const results = callResponse.results.map(call => {
      const callNotes = notes.filter(note => note.gfkObjectId === call.id);
      call.notes = callNotes.length > 0 ? callNotes : [];

      return call;
    });

    setCalls(results);
    setLoading(false);
  }

  async function submitNote(note, item) {
    if (!note.content) {
      errorToast(t('emptyNoteError'));
      return;
    }

    try {
      const response = await Note.post(note);
      const newCalls = calls.map(call => {
        if (call.id === item.id) {
          call.notes = [response, ...call.notes];
        }

        return call;
      });

      setCalls(newCalls);
      successToast(t('modelCreated', { model: 'note' }));
    } catch (e) {
      errorToast(t('noteError'));
    }
  }

  async function deleteNote(note, item) {
    try {
      await Note.del(note.id);
      const newCalls = calls.map(call => {
        if (call.id === item.id) {
          call.notes = call.notes.filter(callNote => callNote.id !== note.id);
        }

        return call;
      });

      setCalls(newCalls);

      const text = t('modelDeleted', { model: 'note' });
      successToast(text);
    } catch (error) {
      errorToast(t('error'));
    }
  }

  useEffect(() => {
    getCalls();
  }, []);

  return (
    <React.Fragment>
      {!loading ? (
        <React.Fragment>
          <div className="content-block-container">
            <div className="content-block">
              <div className="content-block-header">
                <div className="content-block-name">Recent calls</div>
              </div>
            </div>

            <div className="content-block-content">
              {calls.length > 0 && (
                <div className="call-logs">
                  {calls.map(call => (
                    <StreamCall
                      isSidebar
                      item={call}
                      key={`call-${call.id}`}
                      submitNote={submitNote}
                      deleteItemNote={deleteNote}
                    />
                  ))}
                </div>
              )}

              {calls.length === 0 && <div className="p-l-15 p-t-15">{t('noCalls')}</div>}
            </div>
          </div>
        </React.Fragment>
      ) : (
        <LoadingIndicator />
      )}
    </React.Fragment>
  );
}
