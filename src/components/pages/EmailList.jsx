import React, { Component } from 'react';

class EmailList extends Component {
  async componentDidMount() {
    const accountRequest = await EmailAccount.query({ pageSize: 20 });

    this.setState({ emailAccounts: data.results, page: 0, pagination: data.pagination });
  }

  render() {
    return (
      <div>

      </div>
    );
  }
}

export default EmailList;
