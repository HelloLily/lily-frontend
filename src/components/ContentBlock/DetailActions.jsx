import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withTranslation } from 'react-i18next';

import withContext from 'src/withContext';
import LilyTooltip from 'components/LilyTooltip';
import DeleteConfirmation from 'components/Utils/DeleteConfirmation';

const DetailActions = props => {
  const { item, openSidebar, t } = props;
  const { model } = item.contentType;

  return (
    <div className="display-inline-block">
      <button
        className="hl-interface-btn"
        onClick={openSidebar}
        data-tip={t('editAction', { model })}
        data-for={`${model}-${item.id}-edit`}
      >
        <FontAwesomeIcon icon={['far', 'pencil-alt']} />
      </button>

      <LilyTooltip id={`${model}-${item.id}-edit`} place="bottom" />

      <DeleteConfirmation item={item} interfaceButton tooltipPlace="bottom" />
    </div>
  );
};

export default withTranslation('tooltips')(withContext(DetailActions));
