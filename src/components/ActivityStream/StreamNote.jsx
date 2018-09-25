import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Editable from 'components/Editable';
import LilyDate from 'components/Utils/LilyDate';
import StreamAvatar from './StreamAvatar';

const StreamNote = props => {
  const { item, submitCallback } = props;

  const togglePinned = async () => {
    const args = {
      id: item.id,
      isPinned: !item.isPinned
    };

    await props.togglePinned(args);
  };

  return (
    <React.Fragment>
      <StreamAvatar object={item} field="author" />

      <div className="stream-item">
        <div className="stream-item-header">
          <LilyDate date={item.created} includeTime />
        </div>
        <div className="stream-item-title">
          <div>
            {item.author.fullName} created a{item.isPinned && <span> pinned</span>}
            <span className="m-l-5">
              <i className={`lilicon hl-note-icon ${item.isPinned ? 'red' : 'yellow'}`} /> note
            </span>
          </div>

          <div>
            <button className="hl-primary-btn borderless" onClick={togglePinned}>
              {item.isPinned ? (
                <React.Fragment>
                  <FontAwesomeIcon icon="times" /> Unpin
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <i className="lilicon hl-pin-icon" /> Pin
                </React.Fragment>
              )}
            </button>

            <button
              className="hl-primary-btn borderless"
              onClick={() => props.deleteCallback(item)}
            >
              <i className="lilicon hl-trashcan-icon" /> Delete
            </button>
          </div>
        </div>

        <div className={`stream-item-content is-note${item.isPinned ? ' pinned' : ''}`}>
          <div className="stream-item-body">
            <Editable
              type="textarea"
              object={item}
              field="content"
              submitCallback={() => submitCallback(item, 'content')}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default StreamNote;
