import React from 'react';
import Modal from 'react-modal';

const LilyModal = ({ modalOpen, closeModal, alignCenter, children }) => {
  return (
    <Modal
      isOpen={modalOpen}
      onRequestClose={closeModal}
      className={`lily-modal${alignCenter ? ' align-center' : ''}`}
      overlayClassName="modal-overlay"
      parentSelector={() => document.querySelector('#app')}
      ariaHideApp={false}
    >
      <button onClick={closeModal} className="close-btn float-right">
        <i className="lilicon hl-close-icon" />
      </button>

      {children}
    </Modal>
  );
};

export default LilyModal;
