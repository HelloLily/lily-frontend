import React from 'react';
import { Link } from 'react-router-dom';

import LilyDate from 'components/Utils/LilyDate';
import StreamAvatar from './StreamAvatar';

const StreamEmail = props => {
  const { item } = props;

  return (
    <React.Fragment>
      <StreamAvatar object={item} field="user" />

      <div className="stream-item">
        <div className="stream-item-header">
          <LilyDate date={item.sentDate} includeTime />
        </div>
        <div className="stream-item-title">
          <Link to={`/email/${item.id}`}>{item.subject}</Link>
        </div>

        <div className="stream-item-content is-email">
          <div className="stream-item-extra-info">
            <div>
              <strong>From: </strong>

              <Link to={`/email/compose/${item.senderEmail}`}>
                {item.senderName || item.senderEmail}
              </Link>
            </div>

            <div>
              <strong>To: </strong>

              {item.receivedBy.length > 1 && (
                <Link to={`/email/detail/${item.id}`}>{item.receivedBy.length} recipients</Link>
              )}
            </div>

            {item.attachments.length > 0 && (
              <div>
                <strong>Attachments: </strong>

                {item.attachments.length === 1 && (
                  <a href={item.attachments[0].url}>{item.attachments[0].name}</a>
                )}

                {item.attachments.length > 1 && (
                  <Link to={`/email/${item.id}`}>{item.attachments.length} attachments</Link>
                )}
              </div>
            )}
          </div>

          <div className="stream-item-body">{item.body}</div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default StreamEmail;
