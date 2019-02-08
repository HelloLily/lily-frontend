import React from 'react';
import { Link } from 'react-router-dom';

const EmailLink = props => (
  <Link
    to={{
      pathname: '/email/compose',
      state: props.state
    }}
    className={props.className || ''}
  >
    {props.children}
  </Link>
);

export default EmailLink;
