import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Editable from 'components/Editable';
import LilyDate from 'components/Utils/LilyDate';
import StreamAvatar from './StreamAvatar';
import StreamItemNote from './StreamItemNote';
import StreamNoteAdd from './StreamNoteAdd';

class StreamCase extends Component {
  constructor(props) {
    super(props);

    this.state = { showNoteAdd: false };
  }

  toggleNotes = () => {
    const { showNoteAdd } = this.state;

    this.setState({ showNoteAdd: !showNoteAdd });
  };

  submitCallback = args => {
    const { item, submitCallback } = this.props;

    return submitCallback(item, args);
  };

  render() {
    const { showNoteAdd } = this.state;
    const { item } = this.props;

    return (
      <React.Fragment>
        <StreamAvatar object={item} field="assignedTo" />

        <div className="stream-item">
          <div className="stream-item-header">
            <LilyDate date={item.modified} includeTime />
          </div>
          <div className="stream-item-title">
            <div>
              <Editable
                icon
                hideValue
                inlineBlock
                type="select"
                field="priority"
                object={item}
                submitCallback={this.submitCallback}
              />

              <Link to={`/cases/${item.id}`}>{item.subject}</Link>
            </div>

            <button className="hl-interface-btn note-toggle" onClick={this.toggleNotes}>
              <i className="lilicon hl-note-icon" />
            </button>
          </div>

          <div className="stream-item-content is-case">
            <div className="stream-item-extra-info">
              <div>
                <strong className="m-l-5">Status:</strong>
                <Editable
                  inlineBlock
                  type="select"
                  field="status"
                  object={item}
                  submitCallback={this.submitCallback}
                />
              </div>
            </div>

            <div className="stream-item-body">
              <Editable
                type="textarea"
                object={item}
                field="description"
                submitCallback={this.submitCallback}
              />

              <div className="stream-sub-items">
                {showNoteAdd && (
                  <StreamNoteAdd item={item} submitCallback={this.props.submitNote} />
                )}

                {item.notes.map(note => (
                  <StreamItemNote note={note} key={note.id} {...this.props} />
                ))}

                <StreamAvatar object={item} field="createdBy" />

                <div className="stream-sub-item">
                  <div className="stream-item-header">
                    <LilyDate date={item.created} includeTime />
                  </div>
                  <div className="stream-item-title">
                    <div>
                      {item.createdBy ? item.createdBy.fullName : 'An unknown entity'} created the
                      <i className="lilicon hl-case-icon purple m-l-5 font-size-16" /> case
                      <Link to={`/cases/${item.id}`}> {item.subject}</Link>
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

export default StreamCase;
