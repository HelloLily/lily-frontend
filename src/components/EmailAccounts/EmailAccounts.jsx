import React, { Component } from 'react';

import Settings from 'models/Settings';

class EmailAccounts extends Component {
  constructor(props) {
    super(props);

    this.settings = new Settings('inboxAccounts');

    // TODO: Implement loading of previously selected inbox.
    this.state = { emailAccount: props.emailAccount, label: props.label, collapsed: {} };
  }

  static getDerivedStateFromProps = nextProps => ({
    emailAccount: nextProps.emailAccount,
    label: nextProps.label || {}
  });

  async componentDidMount() {
    const settingsResponse = await this.settings.get();

    this.setState({ ...settingsResponse.results });
  }

  labelRenderer = (emailAccount, label) => {
    const className = `email-account-label${
      this.state.label && this.state.label.id === label.id ? ' active' : ''
    }`;
    // Construct the label's class with a padding of 15 per depth level.
    const labelClassName = `email-label p-l-${15 + label.level * 15}`;

    return (
      <React.Fragment>
        <div className={className}>
          <button
            className={labelClassName}
            onClick={() => this.props.setInbox(emailAccount, label)}
          >
            {label.name}
          </button>

          {label.children.length > 0 && (
            <button onClick={() => this.toggleLabel(label)} className="hl-interface-btn m-r-5">
              <i className={`lilicon hl-toggle-${label.collapsed ? 'up' : 'down'}-icon`} />
            </button>
          )}
        </div>

        {label.children.length > 0 &&
          !label.collapsed && (
            <ul>
              {label.children.map(child => (
                <li key={child.id}>{this.labelRenderer(emailAccount, child)}</li>
              ))}
            </ul>
          )}
      </React.Fragment>
    );
  };

  toggleCollapse = account => {
    const { collapsed } = this.state;

    collapsed[account] = !collapsed[account];

    this.settings.store({ collapsed }).then(() => {
      this.setState({ collapsed });
    });
  };

  render() {
    const { collapsed } = this.state;
    const { emailAccounts } = this.props;

    const defaultLabels = [
      { labelId: 'INBOX', name: 'Inbox' },
      { labelId: 'SENT', name: 'Sent' },
      { labelId: 'DRAFT', name: 'Draft' },
      { labelId: 'TRASH', name: 'Trash' },
      { labelId: '', name: 'All mail' }
    ];

    const isAllCollapsed = collapsed.all;

    return (
      <div>
        <div className="label-list">
          <div className="list-header no-border">
            <span className={`label-name${!this.state.emailAccount ? ' account-selected' : ''}`}>
              All mailboxes
            </span>

            <button className="hl-interface-btn" onClick={() => this.toggleCollapse('all')}>
              <i className={`lilicon hl-toggle-${isAllCollapsed ? 'down' : 'up'}-icon`} />
            </button>
          </div>

          {/* {emailAccount.isSyncing &&
            <div className="email-account-syncing" tooltip="Fetching your email. This could take a moment">
              Importing your email
                </div>
          } */}

          {!isAllCollapsed && (
            <ul>
              {defaultLabels.map(label => {
                const defaultLabelClass = `email-account-label${
                  !this.state.emailAccount && this.state.label.labelId === label.labelId
                    ? ' active'
                    : ''
                }`;

                return (
                  <li key={`default-${label.labelId}`}>
                    <div className={defaultLabelClass}>
                      <button
                        className="email-label"
                        onClick={() => this.props.setInbox(null, label)}
                      >
                        {label.name}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {emailAccounts.map(emailAccount => {
          const isSelected = emailAccount === this.state.emailAccount;
          const isCollapsed = collapsed[emailAccount.id];

          return (
            <div key={emailAccount.id} className="label-list">
              <div className="list-header">
                <span className={`label-name${isSelected ? ' account-selected' : ''}`}>
                  {emailAccount.label}
                </span>

                <button
                  className="hl-interface-btn"
                  onClick={() => this.toggleCollapse(emailAccount.id)}
                >
                  <i className={`lilicon hl-toggle-${isCollapsed ? 'down' : 'up'}-icon`} />
                </button>
              </div>

              {!isCollapsed && (
                <React.Fragment>
                  {emailAccount.isSyncing && (
                    <div
                      className="email-account-syncing"
                      tooltip="Fetching your email. This could take a moment"
                    >
                      Importing your email
                    </div>
                  )}

                  <ul>
                    {defaultLabels.map(label => {
                      const defaultLabelClass = `email-account-label${
                        isSelected && this.state.label.labelId === label.labelId ? ' active' : ''
                      }`;

                      return (
                        <li key={`default-${emailAccount.id}-${label.labelId}`}>
                          <div className={defaultLabelClass}>
                            <button
                              className="email-label"
                              onClick={() => this.props.setInbox(emailAccount, label)}
                            >
                              {label.name}
                            </button>
                          </div>
                        </li>
                      );
                    })}

                    {emailAccount.labels.map(label => (
                      <li key={label.id}>{this.labelRenderer(emailAccount, label)}</li>
                    ))}
                  </ul>
                </React.Fragment>
              )}
            </div>
          );
        })}
      </div>
    );
  }
}

export default EmailAccounts;
