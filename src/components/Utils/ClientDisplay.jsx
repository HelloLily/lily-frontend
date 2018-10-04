import React from 'react';
import { Link } from 'react-router-dom';

import DeletedIndicator from 'components/Utils/DeletedIndicator';

const ClientDisplay = props => (
  <React.Fragment>
    {props.contact && (
      <DeletedIndicator object={props.contact} field="fullName">
        <Link to={`/contacts/${props.contact.id}`}>{props.contact.fullName}</Link>
      </DeletedIndicator>
    )}
    {props.contact && props.account && <span> at </span>}
    {props.account && (
      <DeletedIndicator object={props.account} field="name">
        <Link to={`/accounts/${props.account.id}`}>{props.account.name}</Link>
      </DeletedIndicator>
    )}
  </React.Fragment>
);

export default ClientDisplay;
