import React from 'react';
import './feature_unavailable.scss';

const ObjectLimit = props => {
  const { model } = props;

  // TODO: Change to actual text and value.
  const tooltip = `Limit reached for ${model}`;
  const isDisabled = false;

  return (
    <React.Fragment>
      {isDisabled ? (
        <span title={tooltip}>
          <span className="is-disabled">{props.children}</span>
        </span>
      ) : (
        <React.Fragment>{props.children}</React.Fragment>
      )}
    </React.Fragment>
  );
};

export default ObjectLimit;
