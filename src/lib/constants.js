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
    minHeight: '34px',
    borderColor: state.isFocused ? '#27244c' : '#e1e6ef',
    '&:hover': {
      borderColor: state.isFocused ? '#27244c' : '#e1e6ef'
    },
    boxShadow: '0'
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
  menuPortal: base => ({
    ...base,
    zIndex: 10
  }),
  menu: base => ({
    ...base,
    zIndex: 10
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
    color: '#b5b5b5',
    whiteSpace: 'nowrap'
  }),
  clearIndicator: base => ({
    ...base,
    height: '32px',
    padding: '6px 8px'
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

export const ADDRESS_EMPTY_ROW = {
  address: '',
  type: 'visiting',
  postalCode: '',
  city: '',
  country: ''
};

export const WEBSITE_EMPTY_ROW = { website: '', isPrimary: false };

export const ACCOUNT_ACTIVE_STATUS = 'Active';
export const ACCOUNT_RELATION_STATUS = 'Relation';

export const TWITTER_EMPTY_ROW = { name: 'twitter', username: '' };
export const LINKEDIN_EMPTY_ROW = { name: 'linkedin', username: '' };

export const SOCIAL_MEDIA_OPTIONS = [
  { value: 'twitter', label: 'Twitter' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'other', label: 'Other' }
];

export const SOCIAL_MEDIA_EMPTY_ROW = { name: 'other', username: '' };

export const FORM_DATE_FORMAT = 'dd/MM/yyyy';
export const API_DATE_FORMAT = 'yyyy-MM-dd';

export const DEAL_WON_STATUS = 'Won';
export const DEAL_LOST_STATUS = 'Lost';
export const DEAL_NONE_STEP = 'None';

export const INVITE_EMPTY_ROW = { firstName: '', email: '' };

export const INBOX_LABEL = 'INBOX';
export const SENT_LABEL = 'SENT';
export const DRAFT_LABEL = 'DRAFT';
export const TRASH_LABEL = 'TRASH';
export const SPAM_LABEL = 'SPAM';

export const DEFAULT_LABELS = [
  { labelId: INBOX_LABEL, name: 'Inbox' },
  { labelId: SENT_LABEL, name: 'Sent' },
  { labelId: DRAFT_LABEL, name: 'Draft' },
  { labelId: TRASH_LABEL, name: 'Trash' },
  { labelId: '', name: 'All mail' }
];

// List sorting.
export const NO_SORT_STATUS = 0;
export const ASCENDING_STATUS = 1;
export const DESCENDING_STATUS = 2;

export const HOURS_BETWEEN_CHANGES = 1;

export const RINGING_CALL_STATUS = 0;
export const IN_PROGRESS_CALL_STATUS = 1;
export const ENDED_CALL_STATUS = 2;

// Maximum file size allowed per attachment (5 MB).
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Regex to find normal variables.
export const VARIABLE_REGEX = /\[\[ ?([a-z]+\.[a-z_]+) ?]]/g;

// Separate regex for the typed_text variable.
export const TYPED_TEXT_REGEX = /\[\[ template\.typed_text \]\]/;

// Regex to detect if an email address is valid.
// eslint-disable-next-line
export const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Message types.
export const NEW_MESSAGE = 'compose';
export const REPLY_MESSAGE = 'reply';
export const REPLY_ALL_MESSAGE = 'reply-all';
export const FORWARD_MESSAGE = 'forward';
export const FORWARD_MULTI_MESSAGE = 'forward-multi';

export const ENTER_KEY = 13;
export const ESCAPE_KEY = 27;

export const DEBOUNCE_WAIT = 200;
