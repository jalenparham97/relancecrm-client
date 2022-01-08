import { isEmpty } from 'lodash';
import { formatCurrency, formatDate } from '@/utils';
import { Invoice } from '@/types';

export const formatInvoices = (invoices: Invoice[]) => {
  if (!isEmpty(invoices)) {
    return invoices.map((invoice) => ({
      id: invoice._id,
      toName: invoice.toName || '-',
      invoiceNumber: invoice.invoiceNumber,
      amountDue: invoice.amountDue,
      total: formatCurrency(invoice.total),
      subtotal: invoice.subtotal,
      issuedOn: formatDate(invoice.issuedOn),
      dueOn: formatDate(invoice.dueOn),
      status: invoice.status,
    }));
  }
  return [];
};
