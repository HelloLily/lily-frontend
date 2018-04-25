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

    this.state = { items: [] };
  }

  componentDidMount = async () => {
    await this.getItems();
  }

  getItems = async () => {
    const request = await Case.query();

    const total = request.results.length;
    const criticalCount = request.results.filter(item => item.priority === Case.CRITICAL_PRIORITY).length;
    const items = timeCategorize(request.results, 'expires', { id: 22 });

    this.setState({ items, total, criticalCount });
  }

  render() {
    const { items, total, criticalCount } = this.state;

    const title = (
      <React.Fragment>
        <div className="widget-label cases" />
        <div className="widget-name">
          <i className="lilicon hl-case-icon m-r-5" />
          My cases
          <span className="label-amount">{total || '-'}</span>
          <span className="label-amount high-prio" ng-if="vm.highPrioCases">{criticalCount || '-'}</span>
        </div>
      </React.Fragment>
    );

    const categories = [];

    Object.keys(items).forEach(key => {
      const newlyAssigned = key === 'newlyAssigned';
      const className = newlyAssigned ? 'newly-assigned' : '';

      const tbody = (
        <tbody key={key}>
          {items[key].length > 0 &&
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
          {items[key].map(item =>
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

      categories.push(tbody);
    });

    return (
      <div>
        <Widget title={title} component="myCases" expandable>
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
        </Widget>
      </div>
    );
  }
}

export default MyCases;
