import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import Textarea from 'react-textarea-autosize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ENTER_KEY } from 'lib/constants';
import { errorToast } from 'utils/toasts';

class StreamNoteAdd extends Component {
  constructor(props) {
    super(props);

    const note = {
      gfkObjectId: props.item.id,
      gfkContentType: props.item.contentType.id,
      content: ''
    };

    this.state = {
      note,
      loading: false
    };
  }

  submitNote = async () => {
    const { note } = this.state;
    const { item, t } = this.props;

    this.setState({ loading: true });

    try {
      await this.props.submitCallback(note, item);

      note.content = '';

      this.setState({ note });
    } catch (error) {
      errorToast(t('error'));
    }

    this.setState({ loading: false });
  };

  handleContent = event => {
    const { note } = this.state;

    note.content = event.target.value;

    this.setState({ note });
  };

  handleKeyDown = event => {
    if (event.metaKey && event.keyCode === ENTER_KEY) {
      this.submitNote();
    }
  };

  render() {
    const { note, loading } = this.state;

    return (
      <React.Fragment>
        <div className="activity-stream-image">
          <FontAwesomeIcon icon={['far', 'sticky-note']} size="lg" />
        </div>

        <div>
          <Textarea
            className="hl-input"
            placeholder="Write your note here"
            minRows={3}
            maxRows={15}
            value={note.content}
            onChange={this.handleContent}
            onKeyDown={this.handleKeyDown}
          />

          <div className="float-right">
            <button
              disabled={loading}
              className={`hl-primary-btn-blue${loading ? ' is-disabled' : ''}`}
              onClick={this.submitNote}
            >
              Save note
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withTranslation('toasts')(StreamNoteAdd);
