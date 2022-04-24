import { atom } from 'recoil';
import { Invoice, User } from '@/core/types';
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
