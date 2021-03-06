import { Invoice } from '@/core/types';

export type InvoiceEmailOptions = {
  invoiceNumber: string;
  total: string;
  dueDate: string;
  from: string;
  contentSubject?: string;
  subject: string;
  message: string;
  sendUserCopy?: boolean;
  recipients?: string[];
  invoice: Invoice;
};

export type InvoiceTemplateData = {
  invoiceUrl: string;
  contentSubject: string;
  invoiceNumber: string;
  total: string;
  dueDate: string;
  message?: string;
};
