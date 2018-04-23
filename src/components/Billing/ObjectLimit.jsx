import React from 'react';
import './feature_unavailable.scss';

const ObjectLimit = props => {
  const { model } = props;

  // TODO: Change to actual text and value.
  const tooltip = `Limit reached for ${model}`;
  const isDisabled = false;

  return (
    <span>
      {isDisabled ?
        (
          <span title={tooltip}>
            <span className="is-disabled">
              {props.children}
            </span>
          </span>
        ) :
        (
          <span>
            {props.children}
          </span>
        )
      }
    </span>
  );
};

export default ObjectLimit;
