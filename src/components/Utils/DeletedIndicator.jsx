import React from 'react';
import { withNamespaces } from 'react-i18next';

import LilyTooltip from 'components/LilyTooltip';

const DeletedIndicator = props => {
  const { t, object, field } = props;

  return object.isDeleted ? (
    <span className="text-muted">
      <i
        className="lilicon hl-trashcan-icon m-r-5"
        data-tip={t('deletedIndicator', { name: object[field] })}
        data-for={`item-${object.id}`}
      />

      <span>{object[field]}</span>

      <LilyTooltip id={`item-${object.id}`} />
    </span>
  ) : (
    <React.Fragment>{props.children}</React.Fragment>
  );
};

export default withNamespaces('tooltips')(DeletedIndicator);
