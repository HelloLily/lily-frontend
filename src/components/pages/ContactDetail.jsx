import React, { Component } from 'react';

import ContactDetailContentBlock from 'components/ContentBlock/ContactDetailWidget';
import DealListContentBlock from 'components/ContentBlock/DealListWidget';
import CaseListContentBlock from 'components/ContentBlock/CaseListWidget';
import ContactListContentBlock from 'components/ContentBlock/ContactListWidget';
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
            <ContactDetailContentBlock contact={contact} submitCallback={this.submitCallback} />

            <DealListContentBlock object={contact} submitCallback={this.submitCallback} />

            <CaseListContentBlock object={contact} submitCallback={this.submitCallback} />

            <ActivityStream object={contact} />

            {contact.accounts.length > 0 ? (
              <div>
                {contact.accounts.map(account => (
                  <div className="m-b-25" key={account.id}>
                    <ContactListContentBlock object={account} />
                  </div>
                ))}
              </div>
            ) : (
              <ContactListContentBlock object={contact} />
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
