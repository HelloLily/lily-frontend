import React, { Component } from 'react';

import EmailEditor from 'components/EmailEditor';

class EmailCompose extends Component {
  constructor(props) {
    super(props);

    document.title = 'Compose email - Lily';
  }

  render() {
    return (
      <div className="content-block-container">
        <div className="content-block">
          <div className="content-block-header">
            <div className="content-block-name">Compose</div>
          </div>

          <div className="content-block-content no-padding">
            <EmailEditor />
          </div>
        </div>
      </div>
    );
  }
}

export default EmailCompose;
