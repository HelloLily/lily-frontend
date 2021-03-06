import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import withContext from 'src/withContext';
import updateModel from 'utils/updateModel';
import objectToHash from 'utils/objectToHash';
import LoadingIndicator from 'components/Utils/LoadingIndicator';
import Dropdown from 'components/Dropdown';
import ContactDetailWidget from 'components/ContentBlock/ContactDetailWidget';
import DealListWidget from 'components/ContentBlock/DealListWidget';
import CaseListWidget from 'components/ContentBlock/CaseListWidget';
import ContactListWidget from 'components/ContentBlock/ContactListWidget';
import DetailActions from 'components/ContentBlock/DetailActions';
import ActivityStream from 'components/ActivityStream';
import Contact from 'models/Contact';

class ContactDetail extends Component {
  constructor(props) {
    super(props);

    this.mounted = false;
    this.dropdownRef = React.createRef();

    this.state = { contact: null };
  }

  async componentDidMount() {
    this.mounted = true;

    await this.getContact();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  getContact = async () => {
    const { id } = this.props.match.params;
    const contact = await Contact.get(id);

    if (this.mounted) {
      this.setState({ contact });
    }

    document.title = `${contact.fullName} - Lily`;
  };

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

  submitActive = async () => {
    const { contact } = this.state;

    this.setState({ submitting: true });

    const args = {
      id: contact.id,
      functions: contact.functions
    };

    await updateModel(contact, args);

    this.closeMenu();

    this.setState({ submitting: false });
  };

  toggleActive = account => {
    const { contact } = this.state;

    const index = contact.functions.findIndex(func => func.id === account.id);

    contact.functions[index].isActive = !account.isActive;

    this.setState({ contact });
  };

  closeMenu = () => {
    this.dropdownRef.current.closeMenu();
  };

  openSidebar = () => {
    const data = {
      id: this.state.contact.id,
      submitCallback: this.getContact
    };

    this.props.setSidebar('contact', data);
  };

  render() {
    const { contact, submitting } = this.state;

    const extra =
      this.props.match.path.includes('contacts') && contact ? (
        <div>
          {contact.functions.length > 0 && (
            <Dropdown
              ref={this.dropdownRef}
              clickable={
                <button className="hl-interface-btn">
                  <FontAwesomeIcon icon={['far', 'building']} />
                </button>
              }
              menu={
                <React.Fragment>
                  <div className="dropdown-menu has-header">
                    <div className="dropdown-header">Toggle active status</div>

                    <ul className={submitting ? ' is-disabled' : ''}>
                      {contact.functions.map(account => (
                        <li className="dropdown-menu-item" key={account.id}>
                          <input
                            id={account.id}
                            type="checkbox"
                            checked={account.isActive}
                            onChange={() => this.toggleActive(account)}
                          />

                          <label htmlFor={account.id}>{account.accountName}</label>
                        </li>
                      ))}
                    </ul>

                    <div className={`dropdown-footer${submitting ? ' is-disabled' : ''}`}>
                      <button className="hl-primary-btn-blue" onClick={this.submitActive}>
                        Save
                      </button>

                      <button className="hl-primary-btn m-l-10" onClick={this.closeMenu}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              }
            />
          )}

          <DetailActions item={contact} openSidebar={this.openSidebar} />
        </div>
      ) : null;

    return (
      <React.Fragment>
        {contact ? (
          <React.Fragment>
            <div className="detail-page">
              <ContactDetailWidget
                contact={contact}
                submitCallback={this.submitCallback}
                extra={extra}
                key={objectToHash(contact)}
              />

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

export default withTranslation('toasts')(withContext(ContactDetail));
