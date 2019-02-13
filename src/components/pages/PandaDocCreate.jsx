import React, { Component } from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

import withContext from 'src/withContext';
import { post } from 'lib/api';
import { FORM_DATE_FORMAT } from 'lib/constants';
import Deal from 'models/Deal';
import Contact from 'models/Contact';

class PandaDocCreate extends Component {
  async componentDidMount() {
    // PandaDoc SDK is only needed in this component, so dynamically load it here.
    const script = document.createElement('script');
    script.setAttribute('src', '//s3.amazonaws.com/pd-js-sdk/0.2.20/pandadoc-js-sdk.min.js');
    document.body.appendChild(script);

    script.onload = async () => {
      const { currentUser } = this.props;
      const { id } = this.props.match.params;
      const deal = await Deal.get(id);

      const editor = new window.PandaDoc.DocEditor();
      const recipients = [
        {
          first_name: currentUser.firstName,
          last_name: currentUser.lastName,
          email: currentUser.email,
          roleName: 'User'
        }
      ];

      // Setup up the template variables.
      const tokens = {
        // Current user's info.
        'User.FirstName': currentUser.firstName,
        'User.LastName': currentUser.lastName,
        'User.EmailAddress': currentUser.email,
        'User.PhoneNumber': currentUser.phoneNumber,
        Date: format(new Date(), FORM_DATE_FORMAT)
      };

      let docName;
      let account;

      if (deal.contact) {
        const contact = await Contact.get(deal.contact.id);

        tokens['Client.FirstName'] = contact.firstName;
        tokens['Client.LastName'] = contact.lastName;

        recipients.push({
          first_name: contact.firstName,
          last_name: contact.lastName,
          roleName: 'Client'
        });

        if (contact.emailAddresses.length > 0) {
          tokens['Client.Email'] = contact.emailAddresses[0].emailAddress;

          recipients[1].email = contact.emailAddresses[0].emailAddress;
        }

        if (deal.account) {
          ({ account } = deal);
        } else if (contact.accounts.length) {
          [account] = contact.accounts;
        }

        if (account) {
          tokens['Client.Company'] = account.name;

          if (account.addresses.length > 0) {
            const address = account.addresses[0];

            tokens['Client.Address'] = address.address;
            tokens['Client.PostalCode'] = address.postalCode;
            tokens['Client.City'] = address.city;
          }

          docName = account.name;
        }
      }

      editor.show({
        el: '#pandadoc',
        cssClass: 'pandadoc-form',
        data: {
          docName,
          tokens,
          recipients,
          metadata: {
            deal: deal.id,
            account: account ? account.id : null,
            contact: deal.contact ? deal.contact.id : null,
            user: currentUser.id
          }
        },
        events: {
          onDocumentCreated: this.saveDocument
        }
      });
    };
  }

  saveDocument = data => {
    const { deal, contact } = data.document.metadata;
    const args = {
      dealId: deal,
      documentId: data.document.id
    };

    post(`/integrations/documents/${contact}/`, args);
  };

  render() {
    const { id } = this.props.match.params;

    return (
      <div>
        <div>
          <Link to={`/deals/${id}`} className="hl-interface-btn no-padding float-right">
            Back to deal
          </Link>
        </div>
        <div id="pandadoc" />
      </div>
    );
  }
}

export default withContext(PandaDocCreate);
