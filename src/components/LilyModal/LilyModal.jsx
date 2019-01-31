import React from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LilyModal = ({ modalOpen, closeModal, alignCenter, children }) => (
  <Modal
    isOpen={modalOpen}
    onRequestClose={closeModal}
    className={`lily-modal${alignCenter ? ' text-center' : ''} zoom-in`}
    overlayClassName="modal-overlay"
    parentSelector={() => document.querySelector('#app')}
    ariaHideApp={false}
  >
    <button onClick={closeModal} className="close-btn">
      <FontAwesomeIcon icon={['far', 'times']} />
    </button>

    {children}
  </Modal>
);

export default LilyModal;
