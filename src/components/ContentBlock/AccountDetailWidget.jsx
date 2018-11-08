import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import withContext from 'src/withContext';
import { TWITTER_EMPTY_ROW } from 'lib/constants';
import ContentBlock from 'components/ContentBlock';
import Editable from 'components/Editable';

const AccountDetailWidget = ({ account, clickable, currentUser, submitCallback }) => {
  const socialMediaCallback = async args => {
    const isDeleted = args.username === '';
    const profile = {
      ...args,
      isDeleted
    };

    const newArgs = {
      id: account.id,
      socialMedia: [profile]
    };

    await submitCallback(newArgs);
  };

  const twitterCallback = async args => {
    await socialMediaCallback({ ...args, name: 'twitter' });
  };

  const title = (
    <React.Fragment>
      <div className="content-block-label" />
      <div className="content-block-name">
        <i className="lilicon hl-company-icon m-r-5" />
        {clickable &&
          !account.isDeleted && <Link to={`/accounts/${account.id}`}>{account.name}</Link>}

        {(!clickable || account.isDeleted) && <React.Fragment>{account.name}</React.Fragment>}
      </div>
    </React.Fragment>
  );

  const externalAppLink =
    currentUser.tenant.externalAppLinks.length > 0 ? currentUser.tenant.externalAppLinks[0] : null;

  const extra =
    account.customerId && externalAppLink ? (
      <a
        href={externalAppLink.url.replace(/\[\[.+\]\]/, account.customerId)}
        className="hl-primary-btn"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon icon="external-link" className="m-r-5" />
        {externalAppLink.name}
      </a>
    ) : null;

  const twitterProfile = account.socialMedia.find(profile => profile.name === 'twitter');

  account.twitter = twitterProfile || TWITTER_EMPTY_ROW;

  return (
    <ContentBlock title={title} extra={extra} component="accountDetailWidget">
      <div className="detail-row">
        <div>
          <i className="lilicon hl-status-icon" /> Status
        </div>
        <div>
          <Editable type="select" object={account} field="status" submitCallback={submitCallback} />
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
            object={account}
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
            object={account}
            submitCallback={submitCallback}
          />
        </div>
      </div>

      <div className="detail-row">
        <div>
          <FontAwesomeIcon icon="globe" /> Website
        </div>
        <div>
          <Editable
            type="related"
            field="websites"
            object={account}
            submitCallback={submitCallback}
          />
        </div>
      </div>

      <div className="detail-row">
        <div>
          <i className="lilicon hl-entity-icon" /> Assigned to
        </div>
        <div>
          <Editable
            type="select"
            field="assignedTo"
            object={account}
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
            object={account}
            submitCallback={submitCallback}
          />
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
            object={account.twitter}
            submitCallback={twitterCallback}
          >
            {account.twitter.username ? (
              <a href={account.twitter.profileUrl} target="_blank" rel="noopener noreferrer">
                {account.twitter.username}
              </a>
            ) : (
              <span className="editable-empty">No Twitter profile</span>
            )}
          </Editable>
        </div>
      </div>

      <div className="detail-row">
        <div>
          <i className="lilicon hl-entity-icon" /> Customer ID
        </div>
        <div>
          <Editable
            type="text"
            field="customerId"
            object={account}
            submitCallback={submitCallback}
          />
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
            object={account}
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
          object={account}
          submitCallback={submitCallback}
        />
      </div>
    </ContentBlock>
  );
};

export default withContext(AccountDetailWidget);
