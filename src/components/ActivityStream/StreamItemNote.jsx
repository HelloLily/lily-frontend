import React from 'react';
import { withNamespaces } from 'react-i18next';

import { successToast, errorToast } from 'utils/toasts';
import Editable from 'components/Editable';
import LilyDate from 'components/Utils/LilyDate';
import Note from 'models/Note';
import StreamAvatar from './StreamAvatar';

const StreamItemNote = props => {
  const { item, note, deleteItemNote, t } = props;

  const submitNote = async args => {
    try {
      await Note.patch(args);

      const text = t('modelUpdated', { model: 'note' });
      successToast(text);
    } catch (error) {
      errorToast(t('error'));
    }
  };

  return (
    <React.Fragment>
      <StreamAvatar object={note} field="author" />

      <div className="stream-sub-item">
        <div className="stream-item-header">
          <LilyDate date={note.created} includeTime />
        </div>

        <div className="stream-item-title">
          <div>
            {note.author.fullName} created a{note.isPinned && <span> pinned</span>}
            <span className="m-l-5">
              <i className={`lilicon hl-note-icon ${note.isPinned ? 'red' : 'yellow'}`} /> note
            </span>
          </div>

          <button className="hl-primary-btn borderless" onClick={() => deleteItemNote(item, note)}>
            <i className="lilicon hl-trashcan-icon" /> Delete
          </button>
        </div>

        <div>
          <Editable type="textarea" object={note} field="content" submitCallback={submitNote} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default withNamespaces('toasts')(StreamItemNote);
