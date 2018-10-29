import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';

const SuccessToast = ({ text }) => (
  <div>
    <FontAwesomeIcon icon="check" size="lg" />
    <span className="m-l-10">{text}</span>
  </div>
);

const ErrorToast = ({ text }) => (
  <div>
    <FontAwesomeIcon icon="times" size="lg" />
    <span className="m-l-10">{text}</span>
  </div>
);

const WarningToast = ({ text }) => (
  <div>
    <FontAwesomeIcon icon="exclamation-triangle" size="lg" />
    <span className="m-l-10">{text}</span>
  </div>
);

const InfoToast = ({ text }) => (
  <div>
    <FontAwesomeIcon icon="info" size="lg" />
    <span className="m-l-10">{text}</span>
  </div>
);

export function successToast(text) {
  toast.success(<SuccessToast text={text} />);
}

export function errorToast(text) {
  toast.error(<ErrorToast text={text} />);
}

export function warningToast(text) {
  toast.warning(<WarningToast text={text} />);
}

export function infoToast(text) {
  toast.info(<InfoToast text={text} />);
}
