import React from 'react';

import withContext from 'src/withContext';
import FeatureBlock from 'components/Utils/FeatureBlock';

const Integrations = () => (
  <div className="content-block-container">
    <div className="content-block">
      <div className="content-block-header">
        <div className="content-block-name">Integrations</div>
      </div>

      <div className="content-block-content">
        <FeatureBlock tier="2" needsAdmin>
          Integrations page
        </FeatureBlock>
      </div>
    </div>
  </div>
);

export default withContext(Integrations);
