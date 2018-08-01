import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ContentBlock from 'components/ContentBlock';
import Editable from 'components/Editable';

const ContactDetailWidget = props => {
  const { contact, submitCallback, clickable } = props;

  const title = (
    <React.Fragment>
      <div className="content-block-label" />
      <div className="content-block-name">
        <i className="lilicon hl-entity-icon m-r-5" />
        {clickable &&
          !contact.isDeleted && <Link to={`/contacts/${contact.id}`}>{contact.fullName}</Link>}

        {(!clickable || contact.isDeleted) && <React.Fragment>{contact.name}</React.Fragment>}
      </div>
    </React.Fragment>
  );

  return (
    <ContentBlock title={title} component="contactDetailWidget">
      <div className="detail-row">
        <div>
          <FontAwesomeIcon icon="comment" /> Salutation
        </div>
        <div>
          <Editable
            type="select"
            object={contact}
            field="salutation"
            submitCallback={submitCallback}
          />
          /
          <Editable type="select" object={contact} field="gender" submitCallback={submitCallback} />
        </div>
      </div>

      <div className="detail-row">
        <div>
          <i className="lilicon hl-email-icon" /> Email
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
          <i className="lilicon hl-phone-icon" /> Phone
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
          <FontAwesomeIcon icon="map-marker-alt" /> Address
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
          <i className="lilicon hl-company-icon" /> Works at
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
          </Editable>
        </div>
      </div>

      <div className="detail-row">
        <div>
          <FontAwesomeIcon icon={['fab', 'twitter']} /> Twitter
        </div>
        <div>
          {contact.twitter && (
            <a href={contact.twitter.profileUrl} target="_blank" rel="noopener noreferrer">
              {contact.twitter.username}
            </a>
          )}
        </div>
      </div>

      <div className="detail-row">
        <div>
          <FontAwesomeIcon icon={['fab', 'linkedin']} /> LinkedIn
        </div>
        <div>
          {contact.linkedin && (
            <a href={contact.linkedin.profileUrl} target="_blank" rel="noopener noreferrer">
              {contact.linkedin.username}
            </a>
          )}
        </div>
      </div>

      <div className="detail-row">
        <div>
          <FontAwesomeIcon icon="tags" /> Tags
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
