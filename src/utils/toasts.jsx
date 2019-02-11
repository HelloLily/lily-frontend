import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';

const BaseToast = ({ icon, text }) => (
  <div className="display-flex">
    <FontAwesomeIcon icon={['far', icon]} size="lg" />
    <div className="m-l-10">{text}</div>
  </div>
);

const SuccessToast = ({ text }) => <BaseToast icon="check" text={text} />;
const ErrorToast = ({ text }) => <BaseToast icon="exclamation-circle" text={text} />;
const WarningToast = ({ text }) => <BaseToast icon="exclamation-triangle" text={text} />;
const InfoToast = ({ text }) => <BaseToast icon="info" text={text} />;

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
