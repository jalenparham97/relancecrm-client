import { getInvoiceSubtotal } from '.';
import { DefaultInvoice } from '@/store/defaultData';
import { CreateInvoice, Invoice } from '@/types';

export const getInvoiceTotal = (invoice: Invoice | CreateInvoice = DefaultInvoice) => {
  return getInvoiceSubtotal(invoice?.items) + Number(invoice?.tax) - invoice?.discount;
};
