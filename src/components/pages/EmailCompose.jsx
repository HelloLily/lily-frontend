import React, { Component } from 'react';

import EmailEditor from 'components/EmailEditor';
import BlockUI from 'components/Utils/BlockUI';

class EmailCompose extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSending: false
    };

    document.title = 'Compose email - Lily';
  }

  setSending = isSending => {
    this.setState({ isSending });
  };

  render() {
    const { isSending } = this.state;

    return (
      <BlockUI blocking={isSending}>
        <div className="content-block-container">
          <div className="content-block">
            <div className="content-block-header">
              <div className="content-block-name">Compose</div>
            </div>

            <div className="content-block-content no-padding">
              <EmailEditor setSending={this.setSending} {...this.props.location.state} />
            </div>
          </div>
        </div>
      </BlockUI>
    );
  }
}

export default EmailCompose;
