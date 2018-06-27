import libphonenumber from 'google-libphonenumber';

const numberType = libphonenumber.PhoneNumberType;
const numberFormat = libphonenumber.PhoneNumberFormat;
const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

export default function formatPhoneNumber(phoneNumber, user, address = null) {
  if (!phoneNumber || phoneNumber.match(/[a-z]/i)) {
    // If letters are found, skip formatting: it may not be a phone field after all.
    return false;
  }

  const country = address && address.country ? address.country : user.country;
  const parsedNumber = phoneUtil.parse(phoneNumber, country);
  const phoneNumberType = phoneUtil.getNumberType(parsedNumber);

  const isMobile = phoneNumberType === numberType.MOBILE;
  const formatted = phoneUtil.format(parsedNumber, numberFormat.E164);

  return { formatted, isMobile };
}
