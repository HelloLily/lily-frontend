import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import withContext from 'src/withContext';
import updateModel from 'utils/updateModel';
import ContentBlock from 'components/ContentBlock';
import Editable from 'components/Editable';

const AccountDetailWidget = ({ account, clickable, currentUser }) => {
  const submitCallback = args => updateModel(account, args);

  const assignToMe = async () => {
    const args = {
      id: account.id,
      assignedTo: currentUser.id
    }

    await submitCallback(args);
  }

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
            key={JSON.stringify(account.assignedTo)}
            type="select"
            field="assignedTo"
            object={account}
            submitCallback={submitCallback}
          />

          {(!account.assignedTo || account.assignedTo.id !== currentUser.id) && (
            <button
              type="button"
              className="hl-interface-btn"
              onClick={assignToMe}
            >
              Assign to me
            </button>
          )}
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
          <FontAwesomeIcon icon="comment" /> Social
        </div>
        <div>
          <Editable
            type="related"
            field="socialMedia"
            object={account}
            submitCallback={submitCallback}
          />
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
