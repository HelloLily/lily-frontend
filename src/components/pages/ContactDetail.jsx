import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import updateModel from 'utils/updateModel';
import LoadingIndicator from 'components/Utils/LoadingIndicator';
import ContactDetailWidget from 'components/ContentBlock/ContactDetailWidget';
import DealListWidget from 'components/ContentBlock/DealListWidget';
import CaseListWidget from 'components/ContentBlock/CaseListWidget';
import ContactListWidget from 'components/ContentBlock/ContactListWidget';
import ActivityStream from 'components/ActivityStream';
import Contact from 'models/Contact';

class ContactDetail extends Component {
  constructor(props) {
    super(props);

    this.mounted = false;

    this.state = { contact: null };
  }

  async componentDidMount() {
    this.mounted = true;

    const { id } = this.props.match.params;
    const contact = await Contact.get(id);

    if (this.mounted) {
      this.setState({ contact });
    }

    document.title = `${contact.fullName} - Lily`;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  submitCallback = async args => {
    const { contact } = this.state;

    const response = await updateModel(contact, args);

    if (args.hasOwnProperty('socialMedia')) {
      const profile = args.socialMedia[0];
      const index = contact.socialMedia.findIndex(item => item.name === profile.name);

      if (index > -1) {
        if (!profile.isDeleted) {
          contact.socialMedia[index].username = profile.username;
        } else {
          // Profile was deleted, so just remove it.
          contact.socialMedia.splice(index, 1);
        }
      } else {
        // New profile added.
        contact.socialMedia.push(profile);
      }

      // Force the editable components to update.
      this.forceUpdate();
    }

    if (args.hasOwnProperty('accounts')) {
      contact.accounts = response.accounts;
    }

    this.setState({ contact });
  };

  render() {
    const { contact } = this.state;
    const { id } = this.props.match.params;

    return (
      <React.Fragment>
        {contact ? (
          <React.Fragment>
            <div className="detail-page-header">
              <div>
                <Link to={`/contacts/${id}/edit`} className="hl-interface-btn">
                  <i className="lilicon hl-edit-icon" />
                </Link>

                <button className="hl-interface-btn">
                  <i className="lilicon hl-trashcan-icon" />
                </button>
              </div>
            </div>

            <div className="detail-page">
              <ContactDetailWidget contact={contact} submitCallback={this.submitCallback} />

              <DealListWidget object={contact} submitCallback={this.submitCallback} />

              <CaseListWidget object={contact} submitCallback={this.submitCallback} />

              <ActivityStream object={contact} />

              {contact.accounts.length > 0 ? (
                <div>
                  {contact.accounts.map(account => (
                    <div className="m-b-25" key={account.id}>
                      <ContactListWidget object={contact} account={account} />
                    </div>
                  ))}
                </div>
              ) : (
                <ContactListWidget object={contact} />
              )}
            </div>
          </React.Fragment>
        ) : (
          <LoadingIndicator />
        )}
      </React.Fragment>
    );
  }
}

export default ContactDetail;
