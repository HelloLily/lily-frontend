import React, { Component } from 'react';

import withContext from 'src/withContext';
import BlockUI from 'components/Utils/BlockUI';

class WebhookForm extends Component {
  constructor(props) {
    super(props);

    document.title = 'Webhooks - Lily';
  }

  render() {
    return (
      <BlockUI blocking={false}>
        <div className="content-block-container">
          <div className="content-block">
            <div className="content-block-header">
              <div className="content-block-name">My webhooks</div>
            </div>

            <div className="content-block-content" />
          </div>
        </div>
      </BlockUI>
    );
  }
}

export default withContext(WebhookForm);
