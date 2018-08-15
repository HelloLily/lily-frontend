import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Editable from 'components/Editable';
import List from 'components/List';
import ColumnDisplay from 'components/List/ColumnDisplay';
import ListActions from 'components/List/ListActions';
import LilyPagination from 'components/LilyPagination';
import LilyDate from 'components/Utils/LilyDate';
import BlockUI from 'components/Utils/BlockUI';
import Case from 'models/Case';

class CaseList extends Component {
  constructor(props) {
    super(props);

    this.state = { cases: [], pagination: {}, loading: true };
  }

  async componentDidMount() {
    const data = await Case.query({ pageSize: 20 });

    this.setState({
      cases: data.results,
      pagination: data.pagination,
      loading: false
    });
  }

  setPage = async page => {
    this.setState({ loading: true });

    const data = await Case.query({ pageSize: 20, page });

    this.setState({
      cases: data.results,
      pagination: data.pagination,
      loading: false
    });
  };

  submitCallback = args => Case.patch(args);

  render() {
    const { cases, loading, pagination } = this.state;

    return (
      <BlockUI blocking={loading}>
        <List>
          <div className="list-header">
            <ColumnDisplay className="flex-grow" />
          </div>
          <table className="hl-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Subject</th>
                <th>Client</th>
                <th>Type</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Created</th>
                <th>Expires</th>
                <th>Assigned to</th>
                <th>Created by</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cases.map(caseObj => (
                <tr key={caseObj.id}>
                  <td>{caseObj.id}</td>
                  <td>
                    <Link to={`/cases/${caseObj.id}`}>{caseObj.subject}</Link>
                  </td>
                  <td>
                    {caseObj.contact && (
                      <Link to={`/contacts/${caseObj.contact.id}`}>{caseObj.contact.fullName}</Link>
                    )}
                    {caseObj.contact && caseObj.account && <span>at</span>}
                    {caseObj.account && (
                      <Link to={`/accounts/${caseObj.account.id}`}>{caseObj.account.name}</Link>
                    )}
                  </td>
                  <td>{caseObj.type.name}</td>
                  <td>{caseObj.status.name}</td>
                  <td>
                    <Editable
                      type="select"
                      object={caseObj}
                      field="priority"
                      submitCallback={this.submitCallback}
                      icon
                      hideValue
                    />
                  </td>
                  <td>
                    <LilyDate date={caseObj.created} />
                  </td>
                  <td>
                    <LilyDate date={caseObj.expires} />
                  </td>
                  <td>{caseObj.assignedTo ? caseObj.assignedTo.fullName : ''}</td>
                  <td>{caseObj.createdBy ? caseObj.createdBy.fullName : 'Unknown'}</td>
                  <td>
                    {caseObj.tags.map(tag => (
                      <div key={tag.id}>{tag.name}</div>
                    ))}
                  </td>
                  <td>
                    <ListActions object={caseObj} {...this.props} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="list-footer">
            <LilyPagination setPage={this.setPage} pagination={pagination} />
          </div>
        </List>
      </BlockUI>
    );
  }
}

export default CaseList;
