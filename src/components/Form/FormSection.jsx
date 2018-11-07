import React from 'react';

const FormSection = props => (
  <div className="form-section">
    <div className={`form-section-heading${!props.header ? ' no-border' : ''}`}>{props.header}</div>

    <div className="form-section-content">{props.children}</div>
  </div>
);

export default FormSection;
