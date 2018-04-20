import React, { Component } from 'react';

import Editable from 'components/Editable';
import Account from 'src/models/Account';

class AccountDetail extends Component {
  constructor(props) {
    super(props);

    this.state = { account: null };
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    const data = await Account.get(id);

    this.setState({ account: data });
  }

  submitCallback = args => Account.patch(args);

  render() {
    const { account } = this.state;

    return (
      <div>
        {
          account ?
            (
              <div>
                <div>
                  Account detail
                </div>

                <strong>Text</strong>
                <Editable type="text" object={account} field="name" submitCallback={this.submitCallback} />

                <strong>Textarea</strong>
                <Editable type="textarea" object={account} field="description" submitCallback={this.submitCallback} />

                <strong>Select</strong>
                <Editable type="select" object={account} field="assignedTo" submitCallback={this.submitCallback} />
              </div>
            ) :
            (
              <div>
                Loading
              </div>
            )
        }
      </div>
    );
  }
}

export default AccountDetail;
