import React, { Component } from 'react';

import ContactDetailWidget from 'components/Widget/ContactDetailWidget';
import DealListWidget from 'components/Widget/DealListWidget';
import CaseListWidget from 'components/Widget/CaseListWidget';
import ContactListWidget from 'components/Widget/ContactListWidget';
import ActivityStream from 'components/ActivityStream';
import Contact from 'models/Contact';

class AccountDetail extends Component {
  constructor(props) {
    super(props);

    this.state = { contact: null };
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    const data = await Contact.get(id);

    this.setState({ contact: data });
  }

  submitCallback = args => Contact.patch(args);

  render() {
    const { contact } = this.state;

    return (
      <React.Fragment>
        {contact ? (
          <div className="detail-page">
            <ContactDetailWidget contact={contact} submitCallback={this.submitCallback} />

            <DealListWidget object={contact} submitCallback={this.submitCallback} />

            <CaseListWidget object={contact} submitCallback={this.submitCallback} />

            <ActivityStream object={contact} />

            {contact.accounts.length > 0 ? (
              <div>
                {contact.accounts.map(account => (
                  <div className="m-b-25" key={account.id}>
                    <ContactListWidget object={account} />
                  </div>
                ))}
              </div>
            ) : (
              <ContactListWidget object={contact} />
            )}
          </div>
        ) : (
          <div>Loading</div>
        )}
      </React.Fragment>
    );
  }
}

export default AccountDetail;
