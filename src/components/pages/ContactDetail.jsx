import React, { Component } from 'react';

import updateModel from 'utils/updateModel';
import ContactDetailWidget from 'components/ContentBlock/ContactDetailWidget';
import DealListWidget from 'components/ContentBlock/DealListWidget';
import CaseListWidget from 'components/ContentBlock/CaseListWidget';
import ContactListWidget from 'components/ContentBlock/ContactListWidget';
import ActivityStream from 'components/ActivityStream';
import Contact from 'models/Contact';

class ContactDetail extends Component {
  constructor(props) {
    super(props);

    this.state = { contact: null };
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    const contact = await Contact.get(id);

    this.setState({ contact });

    document.title = `${contact.fullName} - Lily`;
  }

  submitCallback = async args => {
    await updateModel(this.state.contact, args);
  };

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

export default ContactDetail;
