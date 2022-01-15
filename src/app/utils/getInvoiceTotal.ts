import { getInvoiceSubtotal } from '.';
import { DefaultInvoice } from '@/app/store/defaultData';
import { CreateInvoice, Invoice } from '@/core/types';

export const getInvoiceTotal = (invoice: Invoice | CreateInvoice = DefaultInvoice) => {
  return getInvoiceSubtotal(invoice?.items) + Number(invoice?.tax) - invoice?.discount;
};
