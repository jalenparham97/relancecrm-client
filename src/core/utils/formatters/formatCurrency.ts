import currency from 'currency.js';

export const formatCurrency = (amount: string | number) => {
  return currency(amount).format();
};
