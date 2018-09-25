import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Editable from 'components/Editable';
import LilyDate from 'components/Utils/LilyDate';
import TimeLogDisplay from 'components/Utils/TimeLogDisplay';
import StreamAvatar from './StreamAvatar';

const StreamTimeLog = props => {
  const { item, submitCallback } = props;

  return (
    <React.Fragment>
      <StreamAvatar object={item} field="user" />

      <div className="stream-item">
        <div className="stream-item-header">
          <LilyDate date={item.date} includeTime />
        </div>
        <div className="stream-item-title">
          <div>{item.user.fullName} logged time</div>

          <div>
            <button
              className="hl-primary-btn borderless"
              onClick={() => props.deleteCallback(item)}
            >
              <i className="lilicon hl-trashcan-icon" /> Delete
            </button>
          </div>
        </div>

        <div className="stream-item-content is-timelog">
          <div className="stream-item-extra-info">
            <div>
              <strong>Logged time: </strong>

              <TimeLogDisplay timeLogs={item} />
            </div>

            <div>
              <strong>Billable: </strong>

              {item.billable ? (
                <React.Fragment>
                  <FontAwesomeIcon icon="check" className="green" /> Yes
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <FontAwesomeIcon icon="times" className="red" /> No
                </React.Fragment>
              )}
            </div>
          </div>

          <div className="stream-item-body">
            <Editable
              type="textarea"
              object={item}
              field="content"
              submitCallback={() => submitCallback(item, args)}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default StreamTimeLog;
