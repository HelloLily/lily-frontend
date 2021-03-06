import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withTranslation } from 'react-i18next';

import withContext from 'src/withContext';
import ContentBlock from 'components/ContentBlock';
import Editable from 'components/Editable';
import BlockUI from 'components/Utils/BlockUI';
import LilyDate from 'components/Utils/LilyDate';
import Postpone from 'components/Postpone';
import Case from 'models/Case';

class CaseListWidget extends Component {
  constructor(props) {
    super(props);

    this.mounted = false;

    this.state = { items: [], loading: true };
  }

  async componentDidMount() {
    this.mounted = true;

    const { object } = this.props;

    const caseRequest = await Case.query({ [`${object.contentType.model}.id`]: object.id });

    if (this.mounted) {
      this.setState({ items: caseRequest.results, loading: false });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  setSidebar = () => {
    const { object } = this.props;
    const { model } = object.contentType;

    this.props.setSidebar('case', { [model]: object });
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
        <div className="content-block-label cases" />
        <div className="content-block-name">
          <FontAwesomeIcon icon={['far', 'briefcase']} className="m-r-5" />
          Cases
        </div>
      </React.Fragment>
    );

    const extra = (
      <button className="hl-primary-btn" onClick={this.setSidebar}>
        <FontAwesomeIcon icon={['far', 'plus']} /> Case
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
                      <Link to={`/cases/${item.id}`}>{item.subject}</Link>
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
                      <Postpone object={item} field="expires" />
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
                        <div className="detail-row">
                          <div>Type</div>
                          <div>{item.type.name}</div>
                        </div>
                        <div className="detail-row">
                          <div>Assigned to</div>
                          <div>{item.assignedTo ? item.assignedTo.fullName : 'Nobody'}</div>
                        </div>
                        <div className="detail-row">
                          <div>Created by</div>
                          <div>
                            {item.createdBy ? item.createdBy.fullName : 'Unknown'}
                            <span> on </span>
                            <LilyDate date={item.created} />
                          </div>
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
                    <td colSpan="5">{t('cases.listWidget')}</td>
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

export default withTranslation('emptyStates')(withContext(CaseListWidget));
