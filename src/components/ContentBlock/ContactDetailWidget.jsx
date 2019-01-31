import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ContentBlock from 'components/ContentBlock';
import Editable from 'components/Editable';

const ContactDetailWidget = ({ contact, submitCallback, clickable }) => {
  const title = (
    <React.Fragment>
      <div className="content-block-label" />
      <div className="content-block-name">
        <FontAwesomeIcon icon={['far', 'user']} className="m-r-5" />
        {clickable && !contact.isDeleted && (
          <Link to={`/contacts/${contact.id}`}>{contact.fullName}</Link>
        )}

        {(!clickable || contact.isDeleted) && <React.Fragment>{contact.fullName}</React.Fragment>}
      </div>
    </React.Fragment>
  );

  return (
    <ContentBlock title={title} component="contactDetailWidget">
      <div className="detail-row">
        <div>
          <FontAwesomeIcon icon={['far', 'comment']} /> Salutation
        </div>
        <div>
          <Editable
            type="select"
            field="salutation"
            object={contact}
            submitCallback={submitCallback}
          />
          /
          <Editable type="select" field="gender" object={contact} submitCallback={submitCallback} />
        </div>
      </div>

      <div className="detail-row">
        <div>
          <FontAwesomeIcon icon={['far', 'envelope']} /> Email
        </div>
        <div>
          <Editable
            type="related"
            field="emailAddresses"
            object={contact}
            submitCallback={submitCallback}
          />
        </div>
      </div>

      <div className="detail-row">
        <div>
          <FontAwesomeIcon icon={['far', 'phone']} flip="horizontal" /> Phone
        </div>
        <div>
          <Editable
            type="related"
            field="phoneNumbers"
            object={contact}
            submitCallback={submitCallback}
          />
        </div>
      </div>

      <div className="detail-row">
        <div>
          <FontAwesomeIcon icon={['far', 'map-marker-alt']} /> Address
        </div>
        <div>
          <Editable
            type="related"
            field="addresses"
            object={contact}
            submitCallback={submitCallback}
          />
        </div>
      </div>

      <div className="detail-row">
        <div>
          <FontAwesomeIcon icon={['far', 'building']} /> Works at
        </div>
        <div>
          <Editable
            multi
            type="select"
            object={contact}
            field="accounts"
            submitCallback={submitCallback}
          >
            {contact.functions.map(account => (
              <div key={account.id}>
                <Link to={`/accounts/${account.id}`}>{account.accountName}</Link>

                {!account.isActive && <span> (inactive)</span>}
              </div>
            ))}

            {contact.accounts.length === 0 && (
              <span className="editable-empty">Not linked to any accounts</span>
            )}
          </Editable>
        </div>
      </div>

      <div className="detail-row">
        <div>
          <FontAwesomeIcon icon={['far', 'comment']} /> Social
        </div>
        <div>
          <Editable
            type="related"
            field="socialMedia"
            object={contact}
            submitCallback={submitCallback}
          />
        </div>
      </div>

      <div className="detail-row">
        <div>
          <FontAwesomeIcon icon={['far', 'tags']} /> Tags
        </div>
        <div>
          <Editable
            multi
            type="tags"
            field="tags"
            object={contact}
            submitCallback={submitCallback}
          />
        </div>
      </div>

      <div className="detail-description">
        <div>
          <strong>Description</strong>
        </div>
        <Editable
          type="textarea"
          field="description"
          object={contact}
          submitCallback={submitCallback}
        />
      </div>
    </ContentBlock>
  );
};

export default ContactDetailWidget;
