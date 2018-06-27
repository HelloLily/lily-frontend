export default function cleanRelatedField(values) {
  const copiedValues = Object.assign({}, values);

  copiedValues.emailAddresses = copiedValues.emailAddresses.filter(
    emailAddress => emailAddress.emailAddress
  );
  copiedValues.phoneNumbers = copiedValues.phoneNumbers.filter(phoneNumber => phoneNumber.number);
  copiedValues.addresses = copiedValues.addresses.filter(address => address.address);
  copiedValues.websites = copiedValues.websites.filter(website => website.website);

  return copiedValues;
}
