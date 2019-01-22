import React, { Component } from 'react';
import { components } from 'react-select';
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable';
import debounce from 'debounce-promise';

import {
  INACTIVE_EMAIL_STATUS,
  EMAIL_REGEX,
  DEBOUNCE_WAIT
} from 'lib/constants';
import Contact from 'models/Contact';

class RecipientField extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      inputValue: '',
      menuIsOpen: false
    }

    this.selectProps = {
      isMulti: true,
      loadOptions: debounce(this.getRecipients, DEBOUNCE_WAIT),
      components: { Option: this.RecipientOption },
      isValidNewOption: props.isValidNewOption,
      className: 'editor-select-input',
      placeholder: 'Add recipients',
      onKeyDown: this.handleKeyDown,
      onInputChange: this.onInputChange,
      onBlur: () => this.setState({ menuIsOpen: false }),
      getOptionValue: option => option.value.emailAddress,
      ...props
    };
  }

  RecipientOption = props => {
    if (props.data.value.hasOwnProperty('emailAddress')) {
      const contact = props.data.value;
      let accounts = '';

      if (contact.functions && contact.functions.length) {
        accounts = ` (${contact.functions.map(account => account.accountName).join(', ')})`;
      }

      return (
        <components.Option {...props}>
          <div>
            <div>
              {contact.fullName} {accounts}
            </div>
            <div className="text-muted">{contact.emailAddress}</div>
          </div>
        </components.Option>
      );
    }

    const { inputValue } = props.selectProps;

    // Render differently for option creation.
    return (
      <components.Option {...props}>
        Add <strong>{inputValue}</strong> as a recipient
      </components.Option>
    );
  };

  onInputChange = inputValue => {
    const menuIsOpen = inputValue !== '' && EMAIL_REGEX.test(inputValue);

    this.setState({ inputValue, menuIsOpen });
  };

  handleKeyDown = event => {
    // Create a new recipient when comma key is pressed.
    if (event.keyCode === 188) {
      // Pressing comma shouldn't put it in the input box.
      event.preventDefault();

      const inputValue = event.target.value;
      const type = event.target.id;
      const { recipients } = this.props;

      if (this.validateEmailAddress(inputValue, recipients)) {
        this.createRecipient(inputValue, type);

        this.setState({ inputValue: '', menuIsOpen: false });
      }
    }
  }

  createRecipient = (option, type) => {
    this.props.onCreateOption(option, type);
    this.setState({ menuIsOpen: false });
  };

  createRecipientLabel = (emailAddress, name = null) =>
    name ? `${name} <${emailAddress}>` : emailAddress;

  createRecipientOptions = (contacts, query = '') => {
    const options = [];

    contacts.forEach(contact => {
      const containsDomain = contact.emailAddresses.some(emailAddress => {
        const emailDomain = emailAddress.emailAddress.split('@').slice(-1)[0];
        return emailDomain === query;
      });

      contact.emailAddresses.forEach(emailAddress => {
        const emailDomain = emailAddress.emailAddress.split('@').slice(-1)[0];
        const isInactive = emailAddress.status === INACTIVE_EMAIL_STATUS;

        // Filter contact's email addresses if we're searching with whole domain.
        if ((containsDomain && emailDomain !== query) || isInactive) {
          return;
        }

        const label = this.createRecipientLabel(emailAddress.emailAddress, contact.fullName);
        const contactCopy = Object.assign({}, contact);

        let functions = [];

        if (contact.functions.length > 0) {
          functions = contact.functions.filter(account => {
            // TODO: This check shouldn't be needed in the live version.
            if (account.domains) {
              // Check if any of the domains contain the email's domain.
              return account.domains.some(domain => domain.includes(emailDomain));
            }

            return [];
          });

          if (functions.length === 0) {
            // Parentheses needed to fix the Eslint rule 'prefer-destructuring'.
            ({ functions } = contact);
          }

          functions = functions.filter(func => func.isActive);

          if (functions.length === 0) {
            // If isn't active at the filtered account(s),
            // don't show the email address at all.
            return;
          }
        }

        contactCopy.functions = functions;
        contactCopy.emailAddress = emailAddress.emailAddress;

        const contactData = {
          label,
          value: contactCopy
        };

        options.push(contactData);
      });
    });

    return options;
  };

  validateEmailAddress = (inputValue, selectValue, selectOptions = []) => {
    const isValid = EMAIL_REGEX.test(inputValue);
    const valueExists = selectValue.findIndex(option =>
      option.value.emailAddress === inputValue
    ) > -1;
    const optionsExists = selectOptions.findIndex(option =>
      option.value.emailAddress === inputValue
    ) > -1;

    // Only valid if it's an actual email address and hasn't already been added.
    return isValid && !valueExists && !optionsExists;
  }

  getRecipients = async (query = '') => {
    let contacts = [];

    if (query) {
      const contactResponse = await Contact.query({ search: query });
      contacts = this.createRecipientOptions(contactResponse.results, query);

      if (contacts.length > 0) {
        this.setState({ menuIsOpen: true });
      }
    }

    return contacts;
  };

  render() {
    const { inputValue, menuIsOpen } = this.state;
    const { recipients } = this.props;

    return (
      <AsyncCreatableSelect
        name="recipients"
        inputId="recipients"
        value={recipients}
        inputValue={inputValue}
        menuIsOpen={menuIsOpen}
        onCreateOption={this.createOption}
        {...this.selectProps}
      />
    );
  }
}

export default RecipientField;
