import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ACCOUNT_RELATION_STATUS } from 'lib/constants';
import Account from 'models/Account';
import Contact from 'models/Contact';

export function NoAccountsMessage(props) {
  const [loading, setLoading] = useState(false);

  const { selectProps } = props;
  const name = selectProps.inputValue;

  const addAccount = async () => {
    setLoading(true);

    const statusRequest = await Account.statuses();
    const relationStatus = statusRequest.results.find(
      status => status.name === ACCOUNT_RELATION_STATUS
    );
    const data = {
      name,
      status: relationStatus.id,
      assignedTo: selectProps.currentUser.id
    };

    const response = await Account.post(data);

    props.setValue('');

    selectProps.callback(response);
  };

  return (
    <React.Fragment>
      {name ? (
        <button
          onClick={addAccount}
          type="button"
          className={`no-options-action${loading ? ' is-disabled' : ''}`}
        >
          <FontAwesomeIcon icon="plus" /> Add <strong>{name}</strong> as a new account
        </button>
      ) : null}
    </React.Fragment>
  );
}

export function NoContactsMessage(props) {
  const [loading, setLoading] = useState(false);
  const { selectProps } = props;
  const name = selectProps.inputValue;

  const addContact = async () => {
    setLoading(true);

    const [firstName, lastName] = name.split(' ');
    const data = {
      firstName,
      lastName
    };

    if (selectProps.account) {
      data.accounts = [{ id: selectProps.account.id }];
    }

    const response = await Contact.post(data);

    props.setValue('');

    selectProps.callback(response);
  };

  return (
    <React.Fragment>
      {name ? (
        <button
          onClick={addContact}
          type="button"
          className={`no-options-action${loading ? ' is-disabled' : ''}`}
        >
          <FontAwesomeIcon icon="plus" /> Add <strong>{name}</strong> as a new contact
        </button>
      ) : null}
    </React.Fragment>
  );
}
