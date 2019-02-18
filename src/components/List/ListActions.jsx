import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withTranslation } from 'react-i18next';

import withContext from 'src/withContext';
import LilyTooltip from 'components/LilyTooltip';
import DeleteConfirmation from 'components/Utils/DeleteConfirmation';

const ListActions = props => {
  const { item, url, t } = props;
  const data = {
    id: item.id,
    submitCallback: props.submitCallback
  };
  const model = props.model || item.contentType.model;

  return (
    <div className="display-inline-block">
      {url ? (
        <Link
          to={url}
          className="hl-primary-btn borderless"
          data-tip={t('editAction', { model })}
          data-for={`${model}-${item.id}-edit`}
        >
          <FontAwesomeIcon icon={['far', 'pencil-alt']} />
        </Link>
      ) : (
        <button
          className="hl-primary-btn borderless"
          onClick={() => props.setSidebar(model, data)}
          data-tip={t('editAction', { model })}
          data-for={`${model}-${item.id}-edit`}
        >
          <FontAwesomeIcon icon={['far', 'pencil-alt']} />
        </button>
      )}

      <LilyTooltip id={`${model}-${item.id}-edit`} />

      <DeleteConfirmation {...props} model={model} />
    </div>
  );
};

export default withTranslation('tooltips')(withContext(ListActions));
