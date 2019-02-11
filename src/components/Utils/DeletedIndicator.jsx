import React from 'react';
import { withTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import LilyTooltip from 'components/LilyTooltip';

const DeletedIndicator = props => {
  const { t, object, field } = props;

  return object.isDeleted ? (
    <span className="text-muted">
      <FontAwesomeIcon
        icon={['far', 'trash-alt']}
        data-tip={t('deletedIndicator', { name: object[field] })}
        data-for={`item-${object.id}`}
        className="m-r-5"
      />

      <span>{object[field]}</span>

      <LilyTooltip id={`item-${object.id}`} />
    </span>
  ) : (
    <React.Fragment>{props.children}</React.Fragment>
  );
};

export default withTranslation('tooltips')(DeletedIndicator);
