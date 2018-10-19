import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';

import { del } from 'lib/api';
import LilyModal from 'components/LilyModal';
import { successToast, errorToast } from 'src/utils/toasts';

class DeleteConfirmation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false
    };
  }

  openModal = () => {
    this.setState({ modalOpen: true });
  };

  closeModal = () => {
    this.setState({ modalOpen: false });
  };

  confirmDelete = async () => {
    const { item, deleteCallback, t } = this.props;

    try {
      await del(`/${item.contentType.appLabel}/${item.id}/`);

      const text = t('toasts:modelDeleted', { model: item.contentType.model });
      successToast(text);

      if (deleteCallback) {
        deleteCallback(item);
      }

      this.closeModal();
    } catch (error) {
      errorToast(t('toasts:error'));
    }
  };

  render() {
    const { item, t } = this.props;

    const display = item.name || item.fullName || item.subject;

    return (
      <React.Fragment>
        <button className="hl-primary-btn borderless m-l-5" onClick={this.openModal}>
          <i className="lilicon hl-trashcan-icon" />
        </button>

        <LilyModal modalOpen={this.state.modalOpen} closeModal={this.closeModal} alignCenter>
          <div>
            <Trans
              defaults={t('alerts:delete.confirmText', { name: display })}
              components={[<strong>text</strong>, <br />]}
            />
          </div>

          <button className="hl-primary-btn-red" onClick={this.confirmDelete}>
            Yes, delete
          </button>
          <button className="hl-primary-btn m-l-10" onClick={this.closeModal}>
            Cancel
          </button>
        </LilyModal>
      </React.Fragment>
    );
  }
}

export default withNamespaces(['alerts', 'toasts'])(DeleteConfirmation);
