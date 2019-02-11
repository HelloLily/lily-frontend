import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  RINGING_CALL_STATUS,
  IN_PROGRESS_CALL_STATUS,
  ENDED_CALL_STATUS,
  PHONE_EMPTY_ROW
} from 'lib/constants';
import LilyDate from 'components/Utils/LilyDate';
import StreamItemNote from './StreamItemNote';
import StreamNoteAdd from './StreamNoteAdd';

class StreamCall extends Component {
  constructor(props) {
    super(props);

    this.isSidebar = this.props.isSidebar || false;

    this.state = { showNoteAdd: false, collapsed: true };
  }

  toggleNotes = () => {
    const { showNoteAdd, collapsed } = this.state;

    const newState = {
      showNoteAdd: !showNoteAdd
    };

    if (collapsed) {
      newState.collapsed = false;

      if (!newState.showNoteAdd) {
        newState.showNoteAdd = true;
      }
    }

    this.setState(newState);
  };

  toggleCollapse = () => {
    const { collapsed } = this.state;

    this.setState({ collapsed: !collapsed });
  };

  openSidebar = item => {
    const phoneNumber = PHONE_EMPTY_ROW;
    phoneNumber.number = item.caller.number;

    this.props.setSidebar('account', { phoneNumbers: [phoneNumber] });
  };

  render() {
    const { showNoteAdd, collapsed } = this.state;
    const { item } = this.props;

    return (
      <React.Fragment>
        <div className="activity-stream-image is-call">
          <span className="fa-layers fa-fw yellow">
            {item.direction === 0 ? (
              <React.Fragment>
                <FontAwesomeIcon
                  icon={['far', 'arrow-up']}
                  transform="rotate--135 shrink-7 up-5 right-6"
                  size="lg"
                />
                <FontAwesomeIcon icon={['far', 'phone']} flip="horizontal" size="lg" />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <FontAwesomeIcon
                  icon={['far', 'arrow-up']}
                  transform="rotate-45 shrink-7 up-5 right-6"
                  size="lg"
                />
                <FontAwesomeIcon icon={['far', 'phone']} flip="horizontal" size="lg" />
              </React.Fragment>
            )}
          </span>
        </div>

        <div className="stream-item">
          <div className="stream-item-header">
            <LilyDate date={item.start} includeTime />
          </div>
          <div className="stream-item-title">
            <button className="collapsible flex-grow" onClick={this.toggleCollapse}>
              {item.caller.name || item.caller.number}

              {item.status === RINGING_CALL_STATUS ? (
                <React.Fragment> is calling</React.Fragment>
              ) : (
                <React.Fragment>
                  {!item.destination && <span> called but nobody picked up.</span>}

                  {item.status === IN_PROGRESS_CALL_STATUS && <span> is calling </span>}

                  {item.status === ENDED_CALL_STATUS && <span> called </span>}

                  {item.status !== RINGING_CALL_STATUS && (
                    <React.Fragment>
                      <span>{item.destination.name || item.destination.number}</span>

                      {item.transfers.length > 0 && item.transfers[0].destination && (
                        <React.Fragment>
                          <span> and </span>
                          {item.transfers.length > 1 && (
                            <span>
                              {item.transfers.length}
                              others
                            </span>
                          )}

                          {item.transfers.length === 1 && (
                            <span>
                              {item.transfers[0].destination.name ||
                                item.transfers[0].destination.number}
                            </span>
                          )}
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
            </button>

            <div>
              {this.isSidebar && !item.caller.name ? (
                <button className="hl-primary-btn" onClick={() => this.openSidebar(item)}>
                  <FontAwesomeIcon icon={['far', 'plus']} /> Account
                </button>
              ) : (
                <React.Fragment>
                  <button className="hl-interface-btn note-toggle" onClick={this.toggleNotes}>
                    {this.isSidebar && item.notes.length > 0 ? (
                      <FontAwesomeIcon icon={['far', 'check-square']} size="lg" className="green" />
                    ) : (
                      <FontAwesomeIcon icon={['far', 'sticky-note']} size="lg" />
                    )}
                  </button>

                  <button className="hl-interface-btn" onClick={this.toggleCollapse}>
                    <FontAwesomeIcon
                      icon={['far', collapsed ? 'angle-down' : 'angle-up']}
                      size="lg"
                    />
                  </button>
                </React.Fragment>
              )}
            </div>
          </div>

          {!collapsed && (
            <div className="stream-item-content is-call">
              <div className="stream-item-extra-info">
                <div>
                  <strong className="m-l-5 m-r-5">Status:</strong>
                  <span>{item.statusDisplay}</span>
                </div>

                <div>
                  <strong>Duration: </strong>
                  <span>{item.duration || 'Unknown'}</span>
                </div>
              </div>

              <div className="stream-item-body">
                {item.status !== RINGING_CALL_STATUS && item.destination && (
                  <React.Fragment>
                    <div className="float-right">
                      <LilyDate date={item.start} includeTime includeSeconds />
                    </div>

                    <span>
                      {item.destination.name || item.destination.number}
                      <span> picked up the phone</span>
                    </span>
                  </React.Fragment>
                )}

                {item.transfers.length > 0 && (
                  <div>
                    {item.transfers.map(transfer => (
                      <div>
                        <LilyDate date={transfer.timestamp} includeTime includeSeconds />

                        {transfer.destination ? (
                          <span>
                            The call was transferred to
                            <span className="m-l-5">
                              {transfer.destination.name || transfer.destination.number}
                            </span>
                          </span>
                        ) : (
                          <span>The call is being transferred, but nobody picked up yet.</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {item.status === RINGING_CALL_STATUS && <div>Nobody picked up yet.</div>}

                {item.status === IN_PROGRESS_CALL_STATUS && <div>Conversation ongoing.</div>}

                {item.status === ENDED_CALL_STATUS && (
                  <div>
                    <div className="float-right">
                      <LilyDate date={item.end} includeTime includeSeconds />
                    </div>
                    Conversation has ended.
                  </div>
                )}

                <div className="stream-sub-items">
                  {showNoteAdd && (
                    <StreamNoteAdd item={item} submitCallback={this.props.submitNote} />
                  )}

                  {item.notes.map(note => (
                    <StreamItemNote note={note} key={note.id} {...this.props} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default StreamCall;
