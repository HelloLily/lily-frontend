import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';

import { errorToast, successToast } from 'utils/toasts';

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
    const { t } = this.props;

    try {
      await this.props.submitCallback(this.props.item, note);

      successToast(t('modelCreated', { model: 'note' }));

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

export default withNamespaces('toasts')(StreamItemNoteAdd);
