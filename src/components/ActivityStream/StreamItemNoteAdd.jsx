import React, { Component } from 'react';

class StreamItemNoteAdd extends Component {
  constructor(props) {
    super(props);

    const note = {
      gfkObjectId: props.item.id,
      gfkContentType: props.item.contentType.id,
      content: ''
    };

    this.state = { note };
  }

  submitNote = async () => {
    const { note } = this.state;

    await this.props.submitItemNote(this.props.item, note);

    // TODO: Add notification on success.

    note.content = '';

    this.setState({ note });
  };

  handleContent = event => {
    const { note } = this.state;

    note.content = event.target.value;

    this.setState({ note });
  };

  render() {
    const { note } = this.state;

    return (
      <React.Fragment>
        <div className="activity-stream-image">
          <i className="lilicon hl-note-icon" />
        </div>

        <div>
          <textarea
            value={note.content}
            onChange={this.handleContent}
            className="hl-input"
            placeholder="Write your note here"
          />

          <div className="float-right">
            <button className="hl-primary-btn-blue" onClick={this.submitNote}>
              Add note
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default StreamItemNoteAdd;
