import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Editable from 'components/Editable';
import LilyDate from 'components/Utils/LilyDate';
import StreamAvatar from './StreamAvatar';
import StreamItemNote from './StreamItemNote';
import StreamItemNoteAdd from './StreamItemNoteAdd';

class StreamDeal extends Component {
  constructor(props) {
    super(props);

    this.state = { showNoteAdd: false };
  }

  toggleNotes = () => {
    this.setState({ showNoteAdd: !this.state.showNoteAdd });
  };

  render() {
    const { showNoteAdd } = this.state;
    const { item, submitCallback } = this.props;

    return (
      <React.Fragment>
        <StreamAvatar object={item} field="assignedTo" />

        <div className="stream-item">
          <div className="stream-item-header">
            <LilyDate date={item.modified} includeTime />
          </div>
          <div className="stream-item-title">
            <div>
              <Link to={`/deals/${item.id}`}>{item.name}</Link>
            </div>

            <button className="hl-interface-btn note-toggle" onClick={this.toggleNotes}>
              <i className="lilicon hl-note-icon" />
            </button>
          </div>

          <div className="stream-item-content is-deal">
            <div className="stream-item-extra-info">
              <div>
                <strong>Status:</strong>
                <Editable
                  type="select"
                  field="status"
                  object={item}
                  submitCallback={() => submitCallback(item, 'status')}
                />
              </div>
            </div>

            <div className="stream-item-body">
              <Editable
                type="textarea"
                object={item}
                field="description"
                submitCallback={() => submitCallback(item, 'description')}
              />

              <div className="stream-sub-items">
                {showNoteAdd && (
                  <StreamItemNoteAdd item={item} submitItemNote={this.props.submitItemNote} />
                )}

                {item.notes.map(note => (
                  <StreamItemNote
                    item={item}
                    note={note}
                    key={note.id}
                    deleteCallback={this.props.deleteItemNote}
                  />
                ))}

                <StreamAvatar object={item} field="createdBy" />

                <div className="stream-sub-item">
                  <div className="stream-item-header">
                    <LilyDate date={item.created} includeTime />
                  </div>
                  <div className="stream-item-title">
                    <div>
                      {item.createdBy ? item.createdBy.fullName : 'An unknown entity'} created the
                      <i className="lilicon hl-deals-icon green m-l-5 font-size-16" /> deal
                      <Link to={`/deals/${item.id}`}> {item.name}</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default StreamDeal;
