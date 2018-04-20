import React from 'react';
import { NavLink } from 'react-router-dom';

import './feature_unavailable.scss';

const FeatureUnavailableMarker = props => {
  const { tier } = props;
  // TODO: Change to actual value.
  const currentTier = 0;

  return (
    <div>
      {currentTier < tier ?
        (
          <div>
            <span className="is-disabled">
              {props.children}
            </span>

            <NavLink to="/preferences/billing" exact className="unavailable-marker m-r-10">
              Unavailable
            </NavLink>
          </div>
        ) :
        (
          <div>{props.children}</div>
        )
      }
    </div>
  );
};

export default FeatureUnavailableMarker;
