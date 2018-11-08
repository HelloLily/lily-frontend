import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { TWITTER_EMPTY_ROW, LINKEDIN_EMPTY_ROW } from 'lib/constants';
import ContentBlock from 'components/ContentBlock';
import Editable from 'components/Editable';

const ContactDetailWidget = ({ contact, submitCallback, clickable }) => {
  const socialMediaCallback = async args => {
    const isDeleted = args.username === '';
    const profile = {
      ...args,
      isDeleted
    };

    const newArgs = {
      id: contact.id,
      socialMedia: [profile]
    };

    await submitCallback(newArgs);
  };

  const twitterCallback = async args => {
    await socialMediaCallback({ ...args, name: 'twitter' });
  };

  const linkedInCallback = async args => {
    await socialMediaCallback({ ...args, name: 'linkedin' });
  };

  const title = (
    <React.Fragment>
      <div className="content-block-label" />
      <div className="content-block-name">
        <i className="lilicon hl-entity-icon m-r-5" />
        {clickable &&
          !contact.isDeleted && <Link to={`/contacts/${contact.id}`}>{contact.fullName}</Link>}

        {(!clickable || contact.isDeleted) && <React.Fragment>{contact.fullName}</React.Fragment>}
      </div>
    </React.Fragment>
  );

  const twitterProfile = contact.socialMedia.find(profile => profile.name === 'twitter');
  const linkedInProfile = contact.socialMedia.find(profile => profile.name === 'linkedin');

  contact.twitter = twitterProfile || TWITTER_EMPTY_ROW;
  contact.linkedIn = linkedInProfile || LINKEDIN_EMPTY_ROW;

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
            {contact.functions.map(func => (
              <div key={func.id}>
                <Link to={`/accounts/${func.account}`}>{func.accountName}</Link>

                {!func.isActive && <span> (inactive)</span>}
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
          <Editable
            type="text"
            field="username"
            object={contact.twitter}
            submitCallback={twitterCallback}
          >
            {contact.twitter.username ? (
              <a href={contact.twitter.profileUrl} target="_blank" rel="noopener noreferrer">
                {contact.twitter.username}
              </a>
            ) : (
              <span className="editable-empty">No Twitter profile</span>
            )}
          </Editable>
        </div>
      </div>

      <div className="detail-row">
        <div>
          <FontAwesomeIcon icon={['fab', 'linkedin']} /> LinkedIn
        </div>
        <div>
          <Editable
            type="text"
            field="username"
            object={contact.linkedIn}
            submitCallback={linkedInCallback}
          >
            {contact.linkedIn.username ? (
              <a href={contact.linkedIn.profileUrl} target="_blank" rel="noopener noreferrer">
                {contact.linkedIn.username}
              </a>
            ) : (
              <span className="editable-empty">No LinkedIn profile</span>
            )}
          </Editable>
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
