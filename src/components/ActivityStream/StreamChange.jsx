import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import LilyDate from 'components/Utils/LilyDate';
import Address from 'components/Utils/Address';
import StreamAvatar from './StreamAvatar';

class StreamChange extends Component {
  constructor(props) {
    super(props);

    this.state = { collapsed: true };
  }

  toggleCollapse = () => {
    const { collapsed } = this.state;

    this.setState({ collapsed: !collapsed });
  };

  render() {
    const { collapsed } = this.state;
    const { item } = this.props;

    const keyBase = `${item.contentType.model}-${item.id}`;

    return (
      <React.Fragment>
        <StreamAvatar object={item} field="user" />

        <div className="stream-item">
          <div className="stream-item-header">
            <LilyDate date={item.created} includeTime />
          </div>
          <button className="stream-item-title collapsable" onClick={this.toggleCollapse}>
            <div>
              <span className="m-r-5">{item.user.fullName} made changes to</span>

              {item.changedKeys.length <= 3 && (
                <span>{item.changedKeys.map(key => key.toLowerCase()).join(' and ')}</span>
              )}

              {item.changedKeys.length > 3 && <span>{item.changedKeys.length} fields</span>}
            </div>

            <FontAwesomeIcon
              fixedWidth
              icon={['far', collapsed ? 'angle-down' : 'angle-up']}
              className="hl-interface-btn m-r-5"
            />
          </button>

          {!collapsed && (
            <div className="stream-item-content m-t-10">
              <div className="stream-item-body change-log">
                <ul>
                  {Object.keys(item.normal).map(field => {
                    const value = item.normal[field];
                    const key = `${keyBase}-${value.changeType}-${field}`;

                    return (
                      <li key={key}>
                        {value.changeType === 'edit' && (
                          <React.Fragment>
                            Changed <strong>{value.displayName.toLowerCase()}</strong> from
                            {field === 'priority' && (
                              <i
                                className={`m-l-5 lilicon hl-prio-icon-${value.old.toLowerCase()}`}
                              />
                            )}
                            {field === 'nextStep' && (
                              <i
                                className={`m-l-5 lilicon step-type position-${value.position}}`}
                              />
                            )}
                            <strong> {value.old}</strong>
                            <span> to </span>
                            {field === 'priority' && (
                              <i
                                className={`m-l-5 lilicon hl-prio-icon-${value.new.toLowerCase()}`}
                              />
                            )}
                            {field === 'nextStep' && (
                              <i
                                className={`m-l-5 lilicon step-type position-${value.position}}`}
                              />
                            )}
                            <strong>{value.new}</strong>
                          </React.Fragment>
                        )}

                        {value.changeType === 'delete' && (
                          <React.Fragment>
                            Removed{' '}
                            {value.old && (
                              <span>
                                <strong>{value.old}</strong> from{' '}
                              </span>
                            )}
                            <strong>{value.displayName}</strong>
                          </React.Fragment>
                        )}

                        {value.changeType === 'add' && (
                          <React.Fragment>
                            Added{' '}
                            {value.new && (
                              <span>
                                <strong>{value.new}</strong> as{' '}
                              </span>
                            )}
                            <strong>{value.displayName}</strong>
                          </React.Fragment>
                        )}
                      </li>
                    );
                  })}
                </ul>

                {item.relatedCount > 0 && (
                  <table className="change-related">
                    <thead>
                      <tr>
                        <th />
                        <th>Before</th>
                        <th>After</th>
                      </tr>
                    </thead>

                    {Object.keys(item.related).map(field => {
                      const tbodyKey = `${keyBase}-${field}`;

                      return (
                        <tbody key={tbodyKey}>
                          {item.related[field].map((value, index) => {
                            const beforeClass = `change-item change-before`;
                            const afterClass = `change-item change-after`;
                            const rowKey = `${tbodyKey}-${index}`;

                            return (
                              <tr key={rowKey}>
                                <td>
                                  {index === 0 && <span>{item.related[field].displayName}</span>}
                                </td>
                                <td
                                  className={`${beforeClass}${!value.old ? ' change-empty' : ''}`}
                                >
                                  {field !== 'addresses' ? (
                                    <span>{value.old}</span>
                                  ) : (
                                    <Address address={value.old} />
                                  )}
                                </td>
                                <td className={`${afterClass}${!value.new ? ' change-empty' : ''}`}>
                                  {field !== 'addresses' ? (
                                    <span>{value.new}</span>
                                  ) : (
                                    <Address address={value.new} />
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      );
                    })}
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default StreamChange;
