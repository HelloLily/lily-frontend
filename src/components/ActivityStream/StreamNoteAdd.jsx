import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import Textarea from 'react-textarea-autosize';

import { errorToast } from 'utils/toasts';

class StreamNoteAdd extends Component {
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
    const { item, t } = this.props;

    try {
      await this.props.submitCallback(note, item);

      note.content = '';

      this.setState({ note });
    } catch (error) {
      errorToast(t('error'));
    }
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
          <Textarea
            className="hl-input"
            placeholder="Write your note here"
            minRows={3}
            maxRows={15}
            value={note.content}
            onChange={this.handleContent}
          />

          <div className="float-right">
            <button
              className={`hl-primary-btn-blue${!note.content ? ' dimmed' : ''}`}
              onClick={this.submitNote}
            >
              Add note
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withNamespaces('toasts')(StreamNoteAdd);
