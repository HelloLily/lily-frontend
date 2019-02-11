import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withTranslation } from 'react-i18next';

import withContext from 'src/withContext';
import ContentBlock from 'components/ContentBlock';
import Editable from 'components/Editable';
import BlockUI from 'components/Utils/BlockUI';
import LilyDate from 'components/Utils/LilyDate';
import LilyCurrency from 'components/Utils/LilyCurrency';
import Postpone from 'components/Postpone';
import Deal from 'models/Deal';

class DealListWidget extends Component {
  constructor(props) {
    super(props);

    this.mounted = false;

    this.state = { items: [], loading: true };
  }

  async componentDidMount() {
    this.mounted = true;

    const { object } = this.props;

    const dealRequest = await Deal.query({ [`${object.contentType.model}.id`]: object.id });

    if (this.mounted) {
      this.setState({ items: dealRequest.results, loading: false });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  setSidebar = () => {
    const { object } = this.props;
    const { model } = object.contentType;

    this.props.setSidebar('deal', { [model]: object });
  };

  toggleCollapse = index => {
    const { items } = this.state;

    items[index].expanded = !items[index].expanded;

    this.setState({ items });
  };

  render() {
    const { items, loading } = this.state;
    const { submitCallback, t } = this.props;

    const title = (
      <React.Fragment>
        <div className="content-block-label deals" />
        <div className="content-block-name">
          <FontAwesomeIcon icon={['far', 'handshake']} className="m-r-5" />
          Deals
        </div>
      </React.Fragment>
    );

    const extra = (
      <button className="hl-primary-btn" onClick={this.setSidebar}>
        <FontAwesomeIcon icon={['far', 'plus']} /> Deal
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
                      <Postpone object={item} field="nextStepDate" />
                    </td>
                    <td>
                      <button
                        className="hl-interface-btn"
                        onClick={() => this.toggleCollapse(index)}
                      >
                        <FontAwesomeIcon
                          icon={['far', item.expanded ? 'angle-up' : 'angle-down']}
                          size="lg"
                        />
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
                          <strong>One-time cost: </strong>
                          <LilyCurrency value={item.amountOnce} currency={item.currency} />
                        </div>
                        <div>
                          <strong>Monthly: </strong>
                          <LilyCurrency value={item.amountRecurring} currency={item.currency} />
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

              {items.length === 0 && (
                <tbody>
                  <tr>
                    <td colSpan="5">{t('deals.listWidget')}</td>
                  </tr>
                </tbody>
              )}
            </table>
          </ContentBlock>
        </BlockUI>
      </div>
    );
  }
}

export default withTranslation('emptyStates')(withContext(DealListWidget));
