import React, { Component } from 'react';
import { withTranslation, Trans } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { del } from 'lib/api';
import { successToast, errorToast } from 'utils/toasts';
import LilyTooltip from 'components/LilyTooltip';
import LilyModal from 'components/LilyModal';

class DeleteConfirmation extends Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();

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
      if (item.contentType) {
        await del(`/${item.contentType.appLabel}/${item.id}/`);

        const text = t('toasts:modelDeleted', { model: item.contentType.model });
        successToast(text);
      }

      this.closeModal();

      if (deleteCallback) {
        deleteCallback(item);
      } else {
        window.location = `/${item.contentType.appLabel}`;
      }
    } catch (error) {
      errorToast(t('toasts:error'));
    }
  };

  render() {
    const { item, showText, interfaceButton, tooltipPlace, t } = this.props;

    const model = this.props.model || item.contentType.model;
    // TODO: Think of a cleaner way.
    const display = item.name || item.fullName || item.subject || item.label || item.email;

    return (
      <React.Fragment>
        <button
          className={interfaceButton ? 'hl-interface-btn' : 'hl-primary-btn borderless'}
          onClick={this.openModal}
          data-tip={t('tooltips:deleteAction', { model })}
          data-for={`${model}-${item.id}-delete`}
          ref={this.ref}
        >
          <FontAwesomeIcon icon={['far', 'trash-alt']} />
          {showText && <span> Delete</span>}
        </button>

        <LilyTooltip id={`${model}-${item.id}-delete`} place={tooltipPlace} />

        <LilyModal modalOpen={this.state.modalOpen} closeModal={this.closeModal}>
          <div className="modal-header">
            <div className="modal-title">{t('modals:delete.confirmTitle')}</div>
          </div>

          <div className="modal-content">
            <Trans
              defaults={t('modals:delete.confirmText', { name: display })}
              components={[<strong>text</strong>]}
            />
            <br />
            {t('modals:delete.confirmTextTwo')}
          </div>

          <div className="modal-footer">
            <button className="hl-primary-btn-red" onClick={this.confirmDelete}>
              Yes, delete
            </button>
            <button className="hl-primary-btn m-l-10" onClick={this.closeModal}>
              Cancel
            </button>
          </div>
        </LilyModal>
      </React.Fragment>
    );
  }
}

export default withTranslation(['modals', 'toasts', 'tooltips'])(DeleteConfirmation);
