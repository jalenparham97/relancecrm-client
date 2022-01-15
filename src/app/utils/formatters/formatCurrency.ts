export const formatCurrency = (amount: string | number) => {
  const currency = Number(amount);
  const formatOptions = { style: 'currency', currency: 'USD' };
  return new Intl.NumberFormat('en-US', formatOptions).format(currency);
};
