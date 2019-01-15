import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withNamespaces } from 'react-i18next';

import LilyTooltip from 'components/LilyTooltip';

const FormFooter = ({ isSubmitting, dirty, handleSubmit, confirmText, errors, indent = true, t }) => (
  <div className="form-section">
    {indent && <div className="form-section-heading no-border" />}
    <div className="form-section-content">
      <button
        disabled={isSubmitting}
        className={`hl-primary-btn-blue${errors.required ? ' dimmed' : ''}`}
        onClick={handleSubmit}
        data-tip={errors.required ? t('requiredFields') : ''}
        type="button"
      >
        <FontAwesomeIcon icon="check" /> {confirmText || 'Save'}
      </button>

      <LilyTooltip />

      <button type="button" className="hl-primary-btn m-l-10" disabled={!dirty || isSubmitting}>
        Cancel
      </button>
    </div>
  </div>
);

export default withNamespaces('tooltips')(FormFooter);
