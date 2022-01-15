export function padInvoiceNumber(invoiceNumber: string, update = false) {
  let numberString: string;

  if (!update) {
    const number = Number(invoiceNumber) + 1;
    numberString = '' + number;
  } else {
    numberString = '' + Number(invoiceNumber);
  }

  while (numberString.length < 6) {
    numberString = '0' + numberString;
  }

  return numberString;
}
