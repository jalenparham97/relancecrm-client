import { Invoice, InvoiceItem, InvoiceStatus, InvoiceTypes } from '@/types';

export const DefaultInvoice: Invoice = {
  _id: '',
  amountDue: 0,
  amountPaid: 0,
  subtotal: 0,
  total: 0,
  tax: 0,
  discount: 0,
  sentDate: '',
  invoiceNumber: '',
  status: InvoiceStatus.DRAFT,
  issuedOn: '',
  dueOn: '',
  type: InvoiceTypes.ONE_TIME,
  fromCompany: '',
  fromAddress: '',
  fromName: '',
  toAddress: '',
  toCompany: '',
  toEmail: '',
  toName: '',
  items: [],
  client: {},
  createdAt: '',
  updatedAt: '',
};

export const createInvoiceItem = (itemId: string): InvoiceItem => {
  return {
    _id: itemId,
    date: '',
    rate: 0,
    tax: 0,
    units: 0,
    unitsType: 'units',
    subtotal: 0,
    description: '',
  };
};
