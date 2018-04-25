import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import Case from 'models/Case';
import Widget from 'components/Widget';
import LilyDate from 'components/utils/LilyDate';
import timeCategorize from 'utils/timeCategorize';

class MyCases extends Component {
  constructor(props) {
    super(props);

    this.state = { categories: [] };
  }

  componentDidMount = async () => {
    const caseRequest = await Case.query();

    const total = caseRequest.results.length;
    const categories = timeCategorize(caseRequest.results, 'expires', { id: 22 });

    this.setState({ categories, total });
  }

  render() {
    const { categories, total } = this.state;

    const highPriorityCount = 5;

    const title = (
      <React.Fragment>
        <div className="widget-label cases" />
        <div className="widget-name">
          <i className="lilicon hl-case-icon m-r-5" />
          My cases
          <span className="label-amount">{total || '-'}</span>
          <span className="label-amount high-prio" ng-if="vm.highPrioCases">{highPriorityCount || '-'}</span>
        </div>
      </React.Fragment>
    );

    const items = [];

    Object.keys(categories).forEach(key => {
      const newlyAssigned = key === 'newlyAssigned';
      const className = newlyAssigned ? 'newly-assigned' : '';

      const tbody = (
        <tbody key={key}>
          {categories[key].length > 0 &&
            <tr className="table-category">
              {newlyAssigned ?
                (
                  <td colSpan="8">Newly assigned to you</td>
                ) :
                (
                  <td colSpan="8" className="text-capitalize">{key}</td>
                )
              }
            </tr>
          }
          {categories[key].map(item =>
            (
              <tr key={item.id} className={className}>
                <td>{item.id}</td>
                <td><NavLink to={`/cases/${item.id}`}>{item.subject}</NavLink></td>
                <td>
                  {item.contact &&
                    <NavLink to={`/contacts/${item.contact.id}`}>{item.contact.fullName}</NavLink>
                  }
                  {(item.contact && item.account) && <span> at </span>}
                  {item.account &&
                    <NavLink to={`/accounts/${item.account.id}`}>{item.account.name}</NavLink>
                  }
                </td>
                <td>{item.type.name}</td>
                <td>{item.status.name}</td>
                <td><i className={`lilicon hl-prio-icon-${item.priorityDisplay.toLowerCase()}`} /></td>
                <td><LilyDate date={item.expires} /></td>
                <td>
                  {newlyAssigned &&
                    <button className="hl-primary-btn round">
                      <FontAwesomeIcon icon="check" />
                    </button>
                  }
                </td>
              </tr>
            ))
          }
        </tbody>
      );

      items.push(tbody);
    });

    return (
      <div>
        <Widget title={title} component="myCases">
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

            {items}
          </table>
        </Widget>
      </div>
    );
  }
}

export default MyCases;
