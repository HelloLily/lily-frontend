import React from 'react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import withContext from 'src/withContext';
import LilyTooltip from 'components/LilyTooltip';
import './feature_unavailable.scss';

const FeatureUnavailableMarker = props => {
  const { tier, currentUser, children, t } = props;

  if (!currentUser.tenant) {
    return <div />;
  }

  const currentTier = currentUser.tenant.billing.plan.tier;
  const tooltip = currentUser.isAdmin
    ? t('featureUnavailableIsAdmin')
    : t('featureUnavailable', { name: currentUser.tenant.admin });

  return (
    <React.Fragment>
      {currentTier < tier ? (
        <div className="display-flex">
          <div className="is-disabled">{children}</div>

          <div data-tip={tooltip}>
            {currentUser.isAdmin ? (
              <Link to="/preferences/billing" className="unavailable-marker m-r-10">
                Unavailable
              </Link>
            ) : (
              <span className="unavailable-marker">Unavailable</span>
            )}
          </div>

          <LilyTooltip />
        </div>
      ) : (
        <React.Fragment>{children}</React.Fragment>
      )}
    </React.Fragment>
  );
};

export default withTranslation('tooltips')(withContext(FeatureUnavailableMarker));
