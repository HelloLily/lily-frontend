import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Editable from 'components/Editable';
import LilyDate from 'components/Utils/LilyDate';
import DeleteConfirmation from 'components/Utils/DeleteConfirmation';
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

  const submitNote = args => submitCallback(item, args);

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
            <FontAwesomeIcon
              icon={['far', 'sticky-note']}
              className={`m-l-5 m-r-5 ${item.isPinned ? 'red' : 'yellow'}`}
            />
            note
          </div>

          <div>
            <button className="hl-primary-btn borderless" onClick={togglePinned}>
              {item.isPinned ? (
                <React.Fragment>
                  <FontAwesomeIcon icon={['far', 'times']} /> Unpin
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <FontAwesomeIcon icon={['far', 'thumbtack']} /> Pin
                </React.Fragment>
              )}
            </button>

            <DeleteConfirmation {...props} showText />
          </div>
        </div>

        <div className={`stream-item-content is-note${item.isPinned ? ' pinned' : ''}`}>
          <div className="stream-item-body">
            <Editable type="textarea" object={item} field="content" submitCallback={submitNote} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default StreamNote;
