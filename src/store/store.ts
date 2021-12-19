import { atom } from 'recoil';
import { CreateInvoice, Invoice, User } from '@/types';
import { DefaultInvoice } from './defaultData';

export const userState = atom<Partial<User>>({
  key: 'userState',
  default: {},
});

export const createInvoiceState = atom<Invoice>({
  key: 'invoiceState',
  default: DefaultInvoice,
});

export * from 'recoil';
