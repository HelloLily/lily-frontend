import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Case from 'models/Case';

const PriorityIcon = ({ priority }) => {
  let icon;

  switch (priority.id) {
    case Case.LOW_PRIORITY:
      icon = (
        <span className="fa-layers fa-fw">
          <FontAwesomeIcon icon="square" className="low-priority-color larger" />
          <FontAwesomeIcon inverse icon="chevron-up" transform="shrink-3 right-0.5" />
        </span>
      );
      break;
    case Case.MEDIUM_PRIORITY:
      icon = (
        <span className="fa-layers fa-fw">
          <FontAwesomeIcon icon="square" className="medium-priority-color larger" />
          <FontAwesomeIcon inverse icon="chevron-up" transform="shrink-3 up-4 right-0.5" />
          <FontAwesomeIcon inverse icon="chevron-up" transform="shrink-3 down-2 right-0.5" />
        </span>
      );
      break;
    case Case.HIGH_PRIORITY:
      icon = (
        <span className="fa-layers fa-fw">
          <FontAwesomeIcon icon="square" className="high-priority-color larger" />
          <FontAwesomeIcon inverse icon="chevron-up" transform="shrink-1 up-5.5 right-0.5" />
          <FontAwesomeIcon inverse icon="chevron-up" transform="shrink-1 up-0.5 right-0.5" />
          <FontAwesomeIcon inverse icon="chevron-up" transform="shrink-1 down-4.25 right-0.5" />
        </span>
      );
      break;
    default:
      icon = (
        <span className="fa-layers fa-fw">
          <FontAwesomeIcon icon="exclamation-square" className="critical-priority-color larger" />
        </span>
      );
      break;
  }

  return <span className="priority-icon m-r-5">{icon}</span>;
};

export default PriorityIcon;
