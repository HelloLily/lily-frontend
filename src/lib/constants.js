// Inbox constants.
export const NEEDS_ALL = 0;
export const NEEDS_CONTACT = 1;
export const NEEDS_ACCOUNT = 2;
export const COMPLETE = 3;

// Contact constants.
export const SALUTATION_OPTIONS = [{ id: 0, name: 'Formal' }, { id: 1, name: 'Informal' }];

export const GENDER_OPTIONS = [
  { id: 0, name: 'Male' },
  { id: 1, name: 'Female' },
  { id: 2, name: 'Unknown/Other' }
];

// Email address constants.
export const INACTIVE_EMAIL_STATUS = 0;
export const OTHER_EMAIL_STATUS = 1;
export const PRIMARY_EMAIL_STATUS = 2;
export const EMAIL_STATUSES = ['Inactive', 'Other', 'Primary'];

export const EMAIL_STATUS_OPTIONS = EMAIL_STATUSES.map((status, index) => ({
  value: index,
  label: status
})).reverse();

export const EMAIL_EMPTY_ROW = { emailAddress: '', status: OTHER_EMAIL_STATUS };

// Phone number constants.
export const WORK_PHONE_TYPE = 'work';
export const MOBILE_PHONE_TYPE = 'mobile';
export const HOME_PHONE_TYPE = 'home';
export const FAX_PHONE_TYPE = 'fax';
export const OTHER_PHONE_TYPE = 'other';

export const PHONE_TYPE_OPTIONS = [
  { value: WORK_PHONE_TYPE, label: 'Work' },
  { value: MOBILE_PHONE_TYPE, label: 'Mobile' },
  { value: HOME_PHONE_TYPE, label: 'Home' },
  { value: FAX_PHONE_TYPE, label: 'Fax' },
  { value: OTHER_PHONE_TYPE, label: 'Other' }
];

export const PHONE_EMPTY_ROW = { number: '', type: WORK_PHONE_TYPE };

// General styling overwrite for react-select selects.
export const SELECT_STYLES = {
  control: (base, state) => ({
    ...base,
    background: '#fff',
    minHeight: '30px',
    height: '34px',
    borderColor: state.isFocused ? '#27244c' : '#e1e6ef'
  }),
  valueContainer: base => ({
    ...base,
    padding: '0 8px'
  }),
  input: base => ({
    ...base,
    paddingTop: '0',
    paddingBottom: '0',
    margin: '0 2px'
  }),
  dropdownIndicator: base => ({
    ...base,
    padding: '4px'
  }),
  option: base => ({
    ...base,
    padding: '6px 12px'
  }),
  menu: base => ({
    ...base,
    zIndex: '10'
  }),
  menuList: base => ({
    ...base,
    paddingTop: '0',
    paddingBottom: '0'
  }),
  multiValueLabel: base => ({
    ...base,
    lineHeight: '24px',
    padding: '0 4px'
  }),
  multiValueRemove: base => ({
    ...base,
    cursor: 'pointer'
  }),
  placeholder: base => ({
    ...base,
    color: '#b5b5b5'
  })
};

export const VISITING_ADDRESS_TYPE = 'visiting';

export const ADDRESS_TYPES = [
  { value: 'visiting', label: 'Visiting address' },
  { value: 'billing', label: 'Billing address' },
  { value: 'shipping', label: 'Shipping address' },
  { value: 'home', label: 'Home address' },
  { value: 'other', label: 'Other' }
];

export const ADDRESS_EMPTY_ROW = { address: '', type: 'visiting' };

export const ACCOUNT_ACTIVE_STATUS = 'Active';
export const ACCOUNT_RELATION_STATUS = 'Relation';

export const TWITTER_EMPTY_ROW = { name: 'twitter', username: '' };
export const LINKEDIN_EMPTY_ROW = { name: 'linkedin', username: '' };

export const FORM_DATE_FORMAT = 'dd/MM/YYYY';

export const DEAL_WON_STATUS = 'Won';
export const DEAL_LOST_STATUS = 'Lost';
export const DEAL_NONE_STEP = 'None';

export const INVITE_EMPTY_ROW = { firstName: '', email: '' };
