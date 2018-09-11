import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import withContext from 'src/withContext';
import timeCategorize from 'utils/timeCategorize';
import BlockUI from 'components/Utils/BlockUI';
import LilyDate from 'components/Utils/LilyDate';
import Editable from 'components/Editable';
import ContentBlock from 'components/ContentBlock';
import Case from 'models/Case';

class MyCases extends Component {
  constructor(props) {
    super(props);

    this.state = { items: [], loading: true };
  }

  componentDidMount = async () => {
    await this.getItems();
  };

  getItems = async () => {
    this.setState({ loading: true });

    const request = await Case.query();
    const total = request.results.length;
    const criticalCount = request.results.filter(item => item.priority === Case.CRITICAL_PRIORITY)
      .length;
    const items = timeCategorize(request.results, 'expires', this.props.currentUser);

    this.setState({ items, total, criticalCount, loading: false });
  };

  acceptCase = async item => {
    this.setState({ loading: true });

    const args = {
      id: item.id,
      newlyAssigned: false
    };

    await Case.patch(args);
    await this.getItems();
  };

  render() {
    const { items, total, criticalCount, loading } = this.state;

    const title = (
      <React.Fragment>
        <div className="content-block-label cases" />
        <div className="content-block-name">
          <i className="lilicon hl-case-icon m-r-5" />
          My cases
          <span className="label-amount">{total || '-'}</span>
          <span className="label-amount high-prio">{criticalCount || '-'}</span>
        </div>
      </React.Fragment>
    );

    const categories = [];

    Object.keys(items).forEach(key => {
      const newlyAssigned = key === 'newlyAssigned';

      const tbody = (
        <tbody key={key}>
          {items[key].length > 0 && (
            <tr className="table-category">
              {newlyAssigned ? (
                <td colSpan="8">Newly assigned to you</td>
              ) : (
                <td colSpan="8" className="text-capitalize">
                  {key}
                </td>
              )}
            </tr>
          )}
          {items[key].map(item => (
            <tr key={item.id} className={newlyAssigned ? 'newly-assigned' : ''}>
              <td>{item.id}</td>
              <td>
                <Link to={`/cases/${item.id}`}>{item.subject}</Link>
              </td>
              <td>
                {item.contact && (
                  <Link to={`/contacts/${item.contact.id}`}>{item.contact.fullName}</Link>
                )}
                {item.contact && item.account && <span> at </span>}
                {item.account && (
                  <Link to={`/accounts/${item.account.id}`}>{item.account.name}</Link>
                )}
              </td>
              <td>{item.type.name}</td>
              <td>{item.status.name}</td>
              <td>
                <Editable
                  type="select"
                  object={item}
                  field="priority"
                  submitCallback={this.submitCallback}
                  icon
                  hideValue
                />
              </td>
              <td>
                <LilyDate date={item.expires} />
              </td>
              <td>
                {newlyAssigned && (
                  <button className="hl-primary-btn round" onClick={() => this.acceptCase(item)}>
                    <FontAwesomeIcon icon="check" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      );

      categories.push(tbody);
    });

    return (
      <BlockUI blocking={loading}>
        <ContentBlock title={title} component="myCases" expandable closeable>
          <table className="hl-table">
            <thead>
              <tr>
                <th>Nr.</th>
                <th>Subject</th>
                <th>Client</th>
                <th>Type</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Expires</th>
                <th>Actions</th>
              </tr>
            </thead>

            {categories}
          </table>
        </ContentBlock>
      </BlockUI>
    );
  }
}

export default withContext(MyCases);
