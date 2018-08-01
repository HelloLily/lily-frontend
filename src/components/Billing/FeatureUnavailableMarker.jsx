import React from 'react';
import { Link } from 'react-router-dom';

import './feature_unavailable.scss';

const FeatureUnavailableMarker = props => {
  const { tier } = props;
  // TODO: Change to actual value.
  const currentTier = 0;

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
        <div>{props.children}</div>
      )}
    </React.Fragment>
  );
};

export default FeatureUnavailableMarker;
