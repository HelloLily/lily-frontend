import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import { NEEDS_ALL, NEEDS_CONTACT, NEEDS_ACCOUNT } from 'lib/constants';

const ContactIcon = props => {
  const { status } = props.emailMessage;

  let icon;

  switch (status) {
    case NEEDS_ALL:
      icon = <i className="lilicon hl-company-icon grey" />;
      break;
    case NEEDS_CONTACT:
      icon = <i className="lilicon hl-entity-icon aqua" />;
      break;
    case NEEDS_ACCOUNT:
      icon = <FontAwesomeIcon icon="check" className="yellow" />;
      break;
    default:
      icon = <FontAwesomeIcon icon="check" className="green" />;
      break;
  }

  return (
    <React.Fragment>
      {icon}
    </React.Fragment>
  );
};

export default ContactIcon;
