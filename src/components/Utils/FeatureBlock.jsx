import React from 'react';
import { Link } from 'react-router-dom';
import { withTranslation, Trans } from 'react-i18next';

import withContext from 'src/withContext';

const FeatureBlock = ({ currentUser, tier = 0, needsAdmin, children, t }) => {
  const currentTier = currentUser.tenant.billing.plan.tier;
  let element = children;

  if (needsAdmin && !currentUser.isAdmin) {
    element = <React.Fragment>{t('forbidden')}</React.Fragment>;
  } else if (currentTier < tier) {
    element = (
      <div>
        {t('featureUnavailableInline')}
        <br />
        <Trans
          defaults={t('featureUnavailableInline2IsAdmin')}
          components={[<Link to="/preferences/billing">text</Link>]}
        />
      </div>
    );
  }

  return element;
};

export default withTranslation('tooltips')(withContext(FeatureBlock));
