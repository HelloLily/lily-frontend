import React, { Component } from 'react';

import List from '../List';
import Account from 'src/models/Account';

class AccountList extends Component {
  async componentDidMount () {
    const data = await Account.query();

    console.log(data);
  }

  render() {
    return (
      <div>
        <List>
          Account list
        </List>
      </div>
    );
  }
}

export default AccountList;
