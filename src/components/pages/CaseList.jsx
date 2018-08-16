import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Editable from 'components/Editable';
import List from 'components/List';
import ColumnDisplay from 'components/List/ColumnDisplay';
import ListActions from 'components/List/ListActions';
import LilyPagination from 'components/LilyPagination';
import LilyDate from 'components/Utils/LilyDate';
import BlockUI from 'components/Utils/BlockUI';
import Settings from 'models/Settings';
import Case from 'models/Case';

class CaseList extends Component {
  constructor(props) {
    super(props);

    this.settings = new Settings('caseList');

    const columns = [
      { key: 'caseId', text: 'NO.', selected: true },
      { key: 'subject', text: 'Subject', selected: true },
      { key: 'client', text: 'Client', selected: true },
      { key: 'type', text: 'Type', selected: true },
      { key: 'status', text: 'Status', selected: true },
      { key: 'priority', text: 'Priority', selected: true },
      { key: 'created', text: 'Created', selected: true },
      { key: 'expires', text: 'Expires', selected: true },
      { key: 'modified', text: 'Modified', selected: false },
      { key: 'assignedTo', text: 'Assigned to', selected: true },
      { key: 'createdBy', text: 'Created by', selected: true },
      { key: 'tags', text: 'Tags', selected: true }
    ];

    this.state = {
      columns,
      cases: [],
      pagination: {},
      loading: true
    };
  }

  async componentDidMount() {
    const settingsResponse = await this.settings.get();
    const data = await Case.query({ pageSize: 20 });

    this.setState({
      ...settingsResponse.results,
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

  toggleColumn = index => {
    const { columns } = this.state;

    columns[index].selected = !columns[index].selected;

    this.settings.store({ columns }).then(() => {
      this.setState({ columns });
    });
  };

  render() {
    const { columns, cases, loading, pagination } = this.state;

    return (
      <BlockUI blocking={loading}>
        <List>
          <div className="list-header">
            <ColumnDisplay columns={columns} toggleColumn={this.toggleColumn} />
          </div>
          <table className="hl-table">
            <thead>
              <tr>
                {columns[0].selected && <th>No.</th>}
                {columns[1].selected && <th>Subject</th>}
                {columns[2].selected && <th>Client</th>}
                {columns[3].selected && <th>Type</th>}
                {columns[4].selected && <th>Status</th>}
                {columns[5].selected && <th>Priority</th>}
                {columns[6].selected && <th>Created</th>}
                {columns[7].selected && <th>Expires</th>}
                {columns[8].selected && <th>Modified</th>}
                {columns[9].selected && <th>Assigned to</th>}
                {columns[10].selected && <th>Created by</th>}
                {columns[11].selected && <th>Tags</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cases.map(caseObj => (
                <tr key={caseObj.id}>
                  {columns[0].selected && <td>{caseObj.id}</td>}
                  {columns[1].selected && (
                    <td>
                      <Link to={`/cases/${caseObj.id}`}>{caseObj.subject}</Link>
                    </td>
                  )}
                  {columns[2].selected && (
                    <td>
                      {caseObj.contact && (
                        <Link to={`/contacts/${caseObj.contact.id}`}>
                          {caseObj.contact.fullName}
                        </Link>
                      )}
                      {caseObj.contact && caseObj.account && <span>at</span>}
                      {caseObj.account && (
                        <Link to={`/accounts/${caseObj.account.id}`}>{caseObj.account.name}</Link>
                      )}
                    </td>
                  )}
                  {columns[3].selected && <td>{caseObj.type.name}</td>}
                  {columns[4].selected && <td>{caseObj.status.name}</td>}
                  {columns[5].selected && (
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
                  )}
                  {columns[6].selected && (
                    <td>
                      <LilyDate date={caseObj.created} />
                    </td>
                  )}
                  {columns[7].selected && (
                    <td>
                      <LilyDate date={caseObj.expires} />
                    </td>
                  )}
                  {columns[8].selected && (
                    <td>{caseObj.assignedTo ? caseObj.assignedTo.fullName : ''}</td>
                  )}
                  {columns[9].selected && (
                    <td>{caseObj.createdBy ? caseObj.createdBy.fullName : 'Unknown'}</td>
                  )}
                  {columns[10].selected && (
                    <td>
                      {caseObj.tags.map(tag => (
                        <div key={tag.id}>{tag.name}</div>
                      ))}
                    </td>
                  )}
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
