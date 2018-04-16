import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import List from 'components/List';
import Contact from 'src/models/Contact';

class ContactList extends Component {
  constructor(props) {
    super(props);

    this.state = { contacts: [] };
  }

  async componentDidMount() {
    const data = await Contact.query();

    this.setState({ contacts: data.results });
  }

  render() {
    const { contacts } = this.state;

    return (
      <div>
        <List>
          <div className="widget-header">
            <h1>
              Contact list
            </h1>
          </div>
          <table className="hl-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact information</th>
                <th>Works at</th>
                <th>Created</th>
                <th>Modified</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(contact => (
                <tr key={contact.id}>
                  <td><NavLink to={`/contacts/${contact.id}`}>{contact.fullName}</NavLink></td>
                  <td>{contact.emailAddresses.toString()}</td>
                  <td>
                    {contact.functions.map(account => (
                      <div key={account.id}>
                        <NavLink to={`/accounts/${account.id}`}>{account.accountName}</NavLink>
                        {!account.is_active && <span> (inactive)</span>}
                      </div>
                    ))}
                  </td>
                  <td>{contact.created}</td>
                  <td>{contact.modified}</td>
                  <td>{contact.tags}</td>
                  <td></td>
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

export default ContactList;
