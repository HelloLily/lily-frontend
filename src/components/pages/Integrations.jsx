import React, { Component } from 'react';

import withContext from 'src/withContext';
import BlockUI from 'components/Utils/BlockUI';

class Integrations extends Component {
  render() {
    return (
      <BlockUI blocking={false}>
        <div className="content-block-container">
          <div className="content-block">
            <div className="content-block-header">
              <div className="content-block-name">Integrations</div>
            </div>

            <div className="content-block-content" />
          </div>
        </div>
      </BlockUI>
    );
  }
}

export default withContext(Integrations);
