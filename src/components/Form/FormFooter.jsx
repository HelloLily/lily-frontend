import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FormFooter = ({ isSubmitting, handleSubmit, confirmText, indent = true }) => (
  <div className="form-section">
    {indent && <div className="form-section-heading no-border" />}
    <div className="form-section-content">
      <button
        disabled={isSubmitting}
        className={`hl-primary-btn-blue${isSubmitting ? ' is-disabled' : ''}`}
        onClick={handleSubmit}
        type="button"
      >
        <FontAwesomeIcon icon={['far', 'check']} /> {confirmText || 'Save'}
      </button>
    </div>
  </div>
);

export default FormFooter;
