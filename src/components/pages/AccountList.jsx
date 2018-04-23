import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import List from 'components/List';
import ListActions from 'components/List/ListActions';
import Editable from 'components/Editable';
import LilyDate from 'components/utils/LilyDate';
import Account from 'src/models/Account';

class AccountList extends Component {
  constructor(props) {
    super(props);

    this.state = { accounts: [] };
  }

  async componentDidMount() {
    const data = await Account.query();

    this.setState({ accounts: data.results });
  }

  render() {
    const { accounts } = this.state;

    return (
      <div>
        <List>
          <div className="widget-header">
            <h1>
              Account list
            </h1>
          </div>
          <table className="hl-table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Contact information</th>
                <th>Assigned to</th>
                <th>Created</th>
                <th>Modified</th>
                <th>Status</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(account => (
                <tr key={account.id}>
                  <td><NavLink to={`/accounts/${account.id}`}>{account.name}</NavLink></td>
                  <td>
                    {account.emailAddresses.map(emailAddress =>
                      (
                        <div key={emailAddress.id}>
                          {emailAddress.status !== 0 ?
                            (
                              <NavLink to={`/email/compose/${emailAddress.emailAddress}`}>
                                <i className="lilicon hl-mail-icon" /> {emailAddress.emailAddress}
                              </NavLink>
                            ) :
                            (
                              null
                            )
                          }
                        </div>
                      ))}
                    {account.phoneNumbers.map(phone =>
                      (
                        <div key={phone.id}>
                          {(phone.type === 'mobile' || phone.type === 'work') ?
                            (
                              <a href={`tel:${phone.number}`}>
                                {phone.type === 'mobile' ?
                                  (
                                    <FontAwesomeIcon icon="mobile" />
                                  ) :
                                  (
                                    <i className="lilicon hl-phone-filled-icon" />
                                  )
                                }

                                <span className="m-l-5">{phone.number}</span>
                              </a>
                            ) :
                            (
                              null
                            )
                          }
                        </div>
                      ))}
                  </td>
                  <td>
                    <Editable type="select" object={account} field="assignedTo" />
                  </td>
                  <td><LilyDate date={account.created} /></td>
                  <td><LilyDate date={account.modified} /></td>
                  <td>{account.status.name}</td>
                  <td>{account.tags}</td>
                  <td><ListActions /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="widget-footer">
            Pagination
          </div>
        </List>
      </div>
    );
  }
}

export default AccountList;
