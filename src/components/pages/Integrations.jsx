import React from 'react';

import withContext from 'src/withContext';

const Integrations = () => (
  <div className="content-block-container">
    <div className="content-block">
      <div className="content-block-header">
        <div className="content-block-name">Integrations</div>
      </div>

      <div className="content-block-content" />
    </div>
  </div>
);

export default withContext(Integrations);
