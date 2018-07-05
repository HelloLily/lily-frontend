import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ContentBlock from 'components/ContentBlock';
import Editable from 'components/Editable';
import BlockUI from 'components/Utils/BlockUI';
import LilyDate from 'components/Utils/LilyDate';
import Case from 'models/Case';

class CaseListWidget extends Component {
  constructor(props) {
    super(props);

    this.state = { items: [], loading: true };
  }

  componentDidMount = async () => {
    const caseRequest = await Case.query({ account: this.props.object });

    this.setState({ items: caseRequest.results, loading: false });
  };

  toggleCollapse = index => {
    const { items } = this.state;

    items[index].expanded = !items[index].expanded;

    this.setState({ items });
  };

  render() {
    const { items, loading } = this.state;
    const { object, submitCallback } = this.props;

    const title = (
      <React.Fragment>
        <div className="content-block-label cases" />
        <div className="content-block-name">
          <i className="lilicon hl-case-icon m-r-5" />
          Cases
        </div>
      </React.Fragment>
    );

    const extra = (
      <button className="hl-primary-btn">
        <FontAwesomeIcon icon="plus" /> Case
      </button>
    );

    return (
      <div>
        <BlockUI blocking={loading}>
          <ContentBlock title={title} extra={extra} component="caseListWidget">
            <table className="hl-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Expires</th>
                  <th />
                </tr>
              </thead>

              {items.map((item, index) => (
                <tbody key={item.id}>
                  <tr>
                    <td>
                      <NavLink to={`/cases/${item.id}`}>{item.subject}</NavLink>
                    </td>
                    <td>{item.status.name}</td>
                    <td>
                      <Editable
                        type="select"
                        object={item}
                        field="priority"
                        submitCallback={submitCallback}
                        icon
                      />
                    </td>
                    <td>
                      <LilyDate date={item.expires} />
                    </td>
                    <td>
                      <button
                        className="hl-interface-btn"
                        onClick={() => this.toggleCollapse(index)}
                      >
                        <i className={`lilicon hl-toggle-${item.expanded ? 'up' : 'down'}-icon`} />
                      </button>
                    </td>
                  </tr>
                  {item.expanded && (
                    <tr>
                      <td colSpan="5">
                        <div>
                          <strong>Type: </strong>
                          {item.type.name}
                        </div>
                        <div>
                          <strong>Assigned to: </strong> {item.assignedTo.fullName || 'Nobody'}
                        </div>
                        <div>
                          <strong>Created by: </strong>
                          {item.createdBy ? item.createdBy.fullName : 'Unknown'}
                          <span> on </span>
                          <LilyDate date={item.created} />
                        </div>
                        {item.description && (
                          <div>
                            <strong>Description: </strong>
                            <div>{item.description}</div>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              ))}
            </table>
          </ContentBlock>
        </BlockUI>
      </div>
    );
  }
}

export default CaseListWidget;
