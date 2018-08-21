import React from 'react';
import { Link } from 'react-router-dom';

import withContext from 'src/withContext';
import './feature_unavailable.scss';

const FeatureUnavailableMarker = props => {
  const { tier, currentUser } = props;
  const currentTier = currentUser.tenant.billing.plan.tier;

  return (
    <React.Fragment>
      {currentTier < tier ? (
        <React.Fragment>
          <span className="is-disabled">{props.children}</span>

          <Link to="/preferences/billing" className="unavailable-marker m-r-10">
            Unavailable
          </Link>
        </React.Fragment>
      ) : (
        <React.Fragment>{props.children}</React.Fragment>
      )}
    </React.Fragment>
  );
};

export default withContext(FeatureUnavailableMarker);
