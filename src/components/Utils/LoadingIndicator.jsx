import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LoadingIndicator = ({ children, small }) => (
  <div className={`loading-indicator${small ? ' small' : ''}`}>
    <div className="loading-header m-l-10">
      {children ? (
        <React.Fragment>{children}</React.Fragment>
      ) : (
        <React.Fragment>Loading</React.Fragment>
      )}

      <div className="text-center m-t-10">
        <FontAwesomeIcon icon="spinner-third" spin />
      </div>
    </div>
  </div>
);

export default LoadingIndicator;
