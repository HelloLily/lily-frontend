import React, { Component } from 'react';

class EmailAccounts extends Component {
  constructor(props) {
    super(props);

    // TODO: Implement loading of previously selected inbox.
    this.state = { emailAccount: null };
  }

  setInbox = (emailAccount, label) => {
    this.setState({ emailAccount });
    this.props.setInbox(emailAccount, label);
  }

  labelRenderer = (emailAccount, label) => {
    return (
      <React.Fragment>
        <div className="email-account-label">
          <button className={`label p-l-${15 + (label.level * 15)}`} onClick={() => this.setInbox(emailAccount, label)}>
            {label.name}
          </button>

          {label.children.length > 0 &&
            <button onClick={() => this.toggleLabel(label)} className="hl-interface-btn m-r-5">
              <i className={`lilicon hl-toggle-${label.collapsed ? 'up' : 'down'}-icon`} />
            </button>
          }
        </div>

        {(label.children.length > 0 && !label.collapsed) &&
          <ul>
            {label.children.map(child =>
              (
                <li key={child.id}>
                  {this.labelRenderer(emailAccount, child)}
                </li>
              ))
            }
          </ul>
        }
      </React.Fragment>
    );
  }

  render() {
    const { emailAccounts } = this.props;

    return (
      <div>
        {emailAccounts.map(emailAccount => {
          const isSelected = emailAccount === this.state.emailAccount;

          return (
            <div key={emailAccount.id} className="label-list">
              <div className="list-header">
                <span className={`label-name${isSelected ? ' account-selected' : ''}`}>
                  {emailAccount.label}
                </span>

                <button className="hl-interface-btn" onClick={this.toggleCollapse}>
                  <i className="lilicon hl-toggle-down-icon" />
                </button>
              </div>

              {emailAccount.isSyncing &&
                <div className="email-account-syncing" tooltip="Fetching your email. This could take a moment">
                  Importing your email
                </div>
              }

              <ul>
                {emailAccount.labels.map(label =>
                  (
                    <li key={label.id}>
                      {this.labelRenderer(emailAccount, label)}
                    </li>
                  ))
                }
              </ul>
            </div>
          );
        })}
      </div>
    );
  }
}

export default EmailAccounts;
