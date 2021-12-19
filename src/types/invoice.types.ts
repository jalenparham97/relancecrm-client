import { PaymentTypes } from '.';
import { Client } from './client.types';
import { Project } from './project.types';

export type InvoiceItem = {
  _id: string;
  date: string;
  rate: number;
  tax: number;
  subtotal: number;
  description: string;
  units: number;
  unitsType: 'units' | 'hrs';
};

export enum InvoiceTypes {
  ONE_TIME = 'one_time',
  RECURRING = 'recurring',
}

export enum InvoiceStatus {
  PAID = 'Paid',
  SENT = 'Sent',
  OVERDUE = 'Overdue',
  READ = 'Read',
  DRAFT = 'Draft',
}

type BaseInvoice = {
  _id?: string;
  amountDue?: number;
  amountPaid?: number;
  subtotal?: number;
  total?: number;
  tax?: number;
  sentDate?: string;
  invoiceNumber?: string;
  status?: InvoiceStatus;
  issuedOn?: string;
  dueOn?: string;
  type?: InvoiceTypes;
  fromCompany?: string;
  fromAddress?: string;
  fromName?: string;
  toAddress?: string;
  toCompany?: string;
  toEmail?: string;
  toName?: string;
  items?: InvoiceItem[];
  taxLabel?: string;
  notes?: string;
  discount?: number;
  recipients?: Client[];
  paymentMethods?: InvoicePaymentMethods;
  paymentDetails?: InvoicePaymentDetails;
  paymentDate?: string;

  createdAt?: string;
  updatedAt?: string;
};

export type Invoice = {
  client?: Client;
  project?: Project;
} & BaseInvoice;

export type CreateInvoice = {
  client?: string;
  project?: string;
} & BaseInvoice;

export type InvoiceEmailData = {
  from?: string;
  contentSubject?: string;
  subject?: string;
  sendUserCopy?: boolean;
  invoice: Invoice;
  message?: string;
  recipients?: string[];
};

export type InvoicePaymentMethods = {
  stripe?: {
    connected: boolean;
    accountId?: string;
  };
  paypal?: {
    connected: boolean;
  };
  zelle?: {
    connected: boolean;
    accountId?: string;
  };
};

export type InvoicePaymentDetails = {
  fee?: number;
  net?: number;
  transactionId?: string;
  payerName?: string;
  paymentMethod?: PaymentTypes;
};
