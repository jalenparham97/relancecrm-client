import { parsePhoneNumber } from 'libphonenumber-js';

export const formatPhoneNumber = (phoneNumber: string) => {
  return parsePhoneNumber(phoneNumber, 'US').formatNational();
};
