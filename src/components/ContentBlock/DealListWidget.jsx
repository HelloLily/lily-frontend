import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import withContext from 'src/withContext';
import ContentBlock from 'components/ContentBlock';
import Editable from 'components/Editable';
import BlockUI from 'components/Utils/BlockUI';
import LilyDate from 'components/Utils/LilyDate';
import Deal from 'models/Deal';

class DealListWidget extends Component {
  constructor(props) {
    super(props);

    this.state = { items: [], loading: true };
  }

  componentDidMount = async () => {
    const dealRequest = await Deal.query({ account: this.props.object });

    this.setState({ items: dealRequest.results, loading: false });
  };

  setSidebar = () => {
    this.props.setSidebar('deal', { object: this.props.object });
  };

  toggleCollapse = index => {
    const { items } = this.state;

    items[index].expanded = !items[index].expanded;

    this.setState({ items });
  };

  render() {
    const { items, loading } = this.state;
    const { submitCallback } = this.props;

    const title = (
      <React.Fragment>
        <div className="content-block-label deals" />
        <div className="content-block-name">
          <i className="lilicon hl-deals-icon m-r-5" />
          Deals
        </div>
      </React.Fragment>
    );

    const extra = (
      <button className="hl-primary-btn" onClick={this.setSidebar}>
        <FontAwesomeIcon icon="plus" /> Deal
      </button>
    );

    return (
      <div>
        <BlockUI blocking={loading}>
          <ContentBlock title={title} extra={extra} component="dealListWidget">
            <table className="hl-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Next step</th>
                  <th>Next step date</th>
                  <th />
                </tr>
              </thead>

              {items.map((item, index) => (
                <tbody key={item.id}>
                  <tr>
                    <td>
                      <Link to={`/deals/${item.id}`}>{item.name}</Link>
                    </td>
                    <td>{item.status.name}</td>
                    <td>
                      <Editable
                        type="select"
                        object={item}
                        field="nextStep"
                        submitCallback={submitCallback}
                        icon
                      />
                    </td>
                    <td>
                      <LilyDate date={item.nextStepDate} />
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
                          <strong>Assigned to: </strong>
                          {item.assignedTo ? item.assignedTo.fullName : 'Nobody'}
                        </div>
                        <div>
                          <strong>Amount once: </strong>
                          {item.amountOnce}
                        </div>
                        <div>
                          <strong>Recurring amount: </strong>
                          {item.amountRecurring}
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

export default withContext(DealListWidget);
