import React from 'react';

const SimpleContentBlock = ({ title, children }) => {
  return (
    <div className="content-block-container">
      <div className="content-block">
        <div className="content-block-header">
          <div className="content-block-title">
            <div className="content-block-name">{title}</div>
          </div>
        </div>

        <div className="content-block-body simple">{children}</div>
      </div>
    </div>
  );
};

export default SimpleContentBlock;
