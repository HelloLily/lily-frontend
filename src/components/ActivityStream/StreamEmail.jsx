import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { REPLY_MESSAGE, FORWARD_MESSAGE } from 'lib/constants';
import LilyDate from 'components/Utils/LilyDate';
import EmailLink from 'components/Utils/EmailLink';
import EmailAccount from 'models/EmailAccount';
import StreamAvatar from './StreamAvatar';

const StreamEmail = ({ item }) => {
  const [showRecipients, setShowRecipients] = useState(false);
  const [t] = useTranslation('tooltips');

  const toggleRecipients = () => {
    setShowRecipients(!showRecipients);
  };

  return (
    <React.Fragment>
      <StreamAvatar object={item} field="user" />

      <div className="stream-item">
        <div className="stream-item-header">
          <LilyDate date={item.sentDate} includeTime />
        </div>
        <div className="stream-item-title">
          {item.account.privacy !== EmailAccount.METADATA ? (
            <React.Fragment>
              {item.subject ? (
                <Link to={`/email/${item.id}`}>{item.subject}</Link>
              ) : (
                <span className="text-muted">No subject</span>
              )}
            </React.Fragment>
          ) : (
            <span>[Subject hidden]</span>
          )}

          {item.account.privacy !== EmailAccount.METADATA && (
            <div>
              <EmailLink
                state={{
                  emailMessage: item,
                  messageType: REPLY_MESSAGE
                }}
                className="hl-interface-btn"
              >
                <FontAwesomeIcon icon={['far', 'reply']} /> Reply
              </EmailLink>

              <EmailLink
                state={{ emailMessage: item, messageType: FORWARD_MESSAGE }}
                className="hl-interface-btn"
              >
                <FontAwesomeIcon icon={['far', 'reply']} flip="horizontal" /> Forward
              </EmailLink>
            </div>
          )}
        </div>

        <div className="stream-item-content is-email">
          <div className="stream-item-extra-info">
            <div>
              <strong className="m-r-5">From:</strong>

              <EmailLink state={{ emailAddress: item.sender.emailAddress }}>
                {item.sender.name || item.sender.emailAddress}
              </EmailLink>
            </div>

            <div>
              <strong>To: </strong>

              <Link to={`/email/detail/${item.id}`}>
                {item.receivedBy.length} {item.receivedBy.length > 1 ? 'recipients' : 'recipient'}
              </Link>

              {showRecipients && (
                <div>
                  {item.receivedBy.map(recipient => (
                    <React.Fragment key={`${item.id}-recipient-${recipient.id}`}>
                      {recipient.name ? (
                        <React.Fragment>
                          {`${recipient.name} <${recipient.emailAddress}>`}
                        </React.Fragment>
                      ) : (
                        <React.Fragment>{recipient.emailAddress}</React.Fragment>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}

              <button className="hl-interface-btn" onClick={toggleRecipients}>
                {showRecipients ? 'Hide' : 'Show'}
              </button>
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

          {item.account.privacy === EmailAccount.METADATA ? (
            <div className="stream-item-body hidden-content">{t('emailMetadataMessage')}</div>
          ) : (
            <div className="stream-item-body">
              {item.bodyText ? (
                <React.Fragment>{item.bodyText}</React.Fragment>
              ) : (
                <span className="text-muted">No body</span>
              )}
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default StreamEmail;
