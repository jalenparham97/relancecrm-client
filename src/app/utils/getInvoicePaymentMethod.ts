import { PaymentTypes } from '@/core/types';

export const getInvoicePaymentMethod = (paymentMethod: PaymentTypes) => {
  switch (paymentMethod) {
    case 'stripe':
      return 'Debit/Credit via Stripe';
    case 'manual':
      return 'Manually marked as paid';
    default:
      return '';
  }
};
