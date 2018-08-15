import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FormFooter = props => (
  <div className="form-section">
    <div className="form-section-heading no-border" />
    <div className="form-section-content">
      <button type="submit" disabled={props.isSubmitting} className="hl-primary-btn-blue">
        <FontAwesomeIcon icon="check" /> {props.confirmText || 'Save'}
      </button>

      <button
        type="button"
        className="hl-primary-btn m-l-10"
        disabled={!props.dirty || props.isSubmitting}
      >
        Cancel
      </button>
    </div>
  </div>
);

export default FormFooter;
