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
        {account ? (
          <div>
            <div>Account detail</div>

            <strong>Text</strong>
            <Editable
              type="text"
              object={account}
              field="name"
              submitCallback={this.submitCallback}
            />

            <strong>Textarea</strong>
            <Editable
              type="textarea"
              object={account}
              field="description"
              submitCallback={this.submitCallback}
            />

            <strong>Select</strong>
            <Editable
              type="select"
              object={account}
              field="assignedTo"
              submitCallback={this.submitCallback}
            />

            <strong>Related (email addresses)</strong>
            <Editable
              type="related"
              object={account}
              field="emailAddresses"
              submitCallback={this.submitCallback}
            />

            <strong>Related (phone numbers)</strong>
            <Editable
              type="related"
              object={account}
              field="phoneNumbers"
              submitCallback={this.submitCallback}
            />

            <strong>Related (addresses)</strong>
            <Editable
              type="related"
              object={account}
              field="addresses"
              submitCallback={this.submitCallback}
            />

            <strong>Related (websites)</strong>
            <Editable
              type="related"
              object={account}
              field="websites"
              submitCallback={this.submitCallback}
            />

            <strong>Tags</strong>
            <Editable
              multi
              type="tags"
              object={account}
              field="tags"
              submitCallback={this.submitCallback}
            />
          </div>
        ) : (
          <div>Loading</div>
        )}
      </div>
    );
  }
}

export default AccountDetail;
