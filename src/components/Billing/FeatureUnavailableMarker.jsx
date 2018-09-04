import React from 'react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import ReactTooltip from 'react-tooltip';

import withContext from 'src/withContext';
import './feature_unavailable.scss';

const FeatureUnavailableMarker = props => {
  const { tier, currentUser, t } = props;
  const currentTier = currentUser.tenant.billing.plan.tier;
  const tooltip = currentUser.isAdmin ? t('featureUnavailableIsAdmin') : t('featureUnavailable');

  return (
    <React.Fragment>
      {currentTier < tier ? (
        <div className="display-flex">
          <div className="is-disabled">{props.children}</div>

          <div data-tip={tooltip}>
            {currentUser.isAdmin ? (
              <Link to="/preferences/billing" className="unavailable-marker m-r-10">
                Unavailable
              </Link>
            ) : (
              <span>Unavailable</span>
            )}
          </div>

          <ReactTooltip />
        </div>
      ) : (
        <React.Fragment>{props.children}</React.Fragment>
      )}
    </React.Fragment>
  );
};

export default translate()(withContext(FeatureUnavailableMarker));
