import { InvoiceItem } from '@/types';

export const getInvoiceSubtotal = (items: InvoiceItem[] = []) => {
  const subtotal = items.reduce(function (accumulator: number, item: InvoiceItem) {
    return accumulator + item.subtotal;
  }, 0);

  return subtotal;
};
