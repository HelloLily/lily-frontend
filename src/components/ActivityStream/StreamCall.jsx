import React, { Component } from 'react';

import { RINGING_CALL_STATUS, IN_PROGRESS_CALL_STATUS, ENDED_CALL_STATUS } from 'lib/constants';
import LilyDate from 'components/Utils/LilyDate';
import StreamItemNote from './StreamItemNote';
import StreamNoteAdd from './StreamNoteAdd';

class StreamCall extends Component {
  constructor(props) {
    super(props);

    this.state = { showNoteAdd: false, collapsed: true };
  }

  toggleNotes = () => {
    const { showNoteAdd } = this.state;

    this.setState({ showNoteAdd: !showNoteAdd });
  };

  toggleCollapse = () => {
    const { collapsed } = this.state;

    this.setState({ collapsed: !collapsed });
  };

  render() {
    const { showNoteAdd, collapsed } = this.state;
    const { item } = this.props;

    const callType = item.direction === 0 ? 'inbound' : 'outbound';

    return (
      <React.Fragment>
        <div className="activity-stream-image is-call">
          <i className={`lilicon hl-phone-${callType}-icon yellow`} />
        </div>

        <div className="stream-item">
          <div className="stream-item-header">
            <LilyDate date={item.start} includeTime />
          </div>
          <div className="stream-item-title">
            <button className="collapsable flex-grow" onClick={this.toggleCollapse}>
              {item.caller.name || item.caller.number}

              {item.status === RINGING_CALL_STATUS ? (
                <React.Fragment> is calling</React.Fragment>
              ) : (
                <React.Fragment>
                  {!item.destination && <span> called but nobody picked up.</span>}

                  {item.status === IN_PROGRESS_CALL_STATUS && <span> is calling with </span>}

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
              <button className="hl-interface-btn note-toggle" onClick={this.toggleNotes}>
                <i className="lilicon hl-note-icon" />
              </button>

              <button className="hl-interface-btn" onClick={this.toggleCollapse}>
                <i className={`lilicon hl-toggle-${collapsed ? 'down' : 'up'}-icon`} />
              </button>
            </div>
          </div>

          {!collapsed && (
            <div className="stream-item-content is-call">
              <div className="stream-item-extra-info">
                <div>
                  <strong className="m-l-5">Status:</strong>
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
                            The call was transferred to{' '}
                            {transfer.destination.name || transfer.destination.number}
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
