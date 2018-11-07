import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FormFooter = ({ isSubmitting, dirty, handleSubmit, confirmText, indent = true }) => (
  <div className="form-section">
    {indent && <div className="form-section-heading no-border" />}
    <div className="form-section-content">
      <button
        disabled={isSubmitting}
        className="hl-primary-btn-blue"
        onClick={handleSubmit}
        type="button"
      >
        <FontAwesomeIcon icon="check" /> {confirmText || 'Save'}
      </button>

      <button type="button" className="hl-primary-btn m-l-10" disabled={!dirty || isSubmitting}>
        Cancel
      </button>
    </div>
  </div>
);

export default FormFooter;
