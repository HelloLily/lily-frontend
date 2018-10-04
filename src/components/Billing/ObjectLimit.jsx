import React from 'react';
import { withNamespaces } from 'react-i18next';

import LilyTooltip from 'components/LilyTooltip';
import './feature_unavailable.scss';

const ObjectLimit = props => {
  const { model, t } = props;

  const tooltip = t('limitReached', { model });
  // TODO: Change to actual value.
  const isDisabled = false;

  return (
    <React.Fragment>
      {isDisabled ? (
        <React.Fragment>
          <span data-tip={tooltip}>
            <span className="is-disabled">{props.children}</span>
          </span>

          <LilyTooltip />
        </React.Fragment>
      ) : (
        <React.Fragment>{props.children}</React.Fragment>
      )}
    </React.Fragment>
  );
};

export default withNamespaces('tooltips')(ObjectLimit);
