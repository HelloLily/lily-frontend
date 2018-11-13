import React from 'react';
import { withNamespaces } from 'react-i18next';

import withContext from 'src/withContext';
import LilyTooltip from 'components/LilyTooltip';
import './feature_unavailable.scss';

const ObjectLimit = props => {
  const { currentUser, model, t } = props;

  const tooltip = t('limitReached', { model });
  const isDisabled = currentUser.limitReached ? currentUser.limitReached[model] : false;

  return (
    <React.Fragment>
      {isDisabled ? (
        <React.Fragment>
          <span data-tip={tooltip} data-for={`${model}-limit`}>
            <span className="is-disabled">{props.children}</span>
          </span>

          <LilyTooltip id={`${model}-limit`} />
        </React.Fragment>
      ) : (
        <React.Fragment>{props.children}</React.Fragment>
      )}
    </React.Fragment>
  );
};

export default withNamespaces('tooltips')(withContext(ObjectLimit));
