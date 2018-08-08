import React from 'react';

export const AppContext = React.createContext();

export default function withContext(Component) {
  return function ConnectedComponent(props) {
    return (
      <AppContext.Consumer>{context => <Component {...props} {...context} />}</AppContext.Consumer>
    );
  };
}
