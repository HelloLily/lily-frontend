import React, { Component } from 'react';

import withContext from 'src/withContext';
import BlockUI from 'components/Utils/BlockUI';
import FormSection from 'components/Utils/FormSection';

class TokenForm extends Component {
  constructor(props) {
    super(props);

    document.title = 'Import - Lily';
  }

  render() {
    return (
      <BlockUI blocking={false}>
        <div className="content-block-container">
          <div className="content-block">
            <div className="content-block-header">
              <div className="content-block-name">Import accounts & contacts</div>
            </div>

            <div className="content-block-content">
              <FormSection header="Import accounts" />

              <FormSection header="Import contacts" />
            </div>
          </div>
        </div>
      </BlockUI>
    );
  }
}

export default withContext(TokenForm);
