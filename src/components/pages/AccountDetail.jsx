import React, { Component } from 'react';

import Editable from 'components/Editable/Editable';
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

                <Editable type="text" object={account} field="name" />
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
