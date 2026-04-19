export function formatCurrency(amount, currency = 'INR') {
  const symbols = {
    INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥', AED: 'AED ', SGD: 'S$'
  };
  const symbol = symbols[currency] || currency + ' ';
  const formatted = Math.abs(amount).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  return `${symbol}${formatted}`;
}

export const CATEGORIES = [
  'Food', 'Travel', 'Rent', 'Shopping', 'Entertainment',
  'Health', 'Utilities', 'Subscriptions', 'Education', 'Other'
];

export const CATEGORY_COLORS = {
  Food: '#f05a7e',
  Travel: '#7c6af7',
  Rent: '#22d3a0',
  Shopping: '#fbbf24',
  Entertainment: '#38bdf8',
  Health: '#fb923c',
  Utilities: '#a78bfa',
  Subscriptions: '#34d399',
  Education: '#f472b6',
  Other: '#94a3b8',
  Income: '#22d3a0',
};

export const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'AED', 'SGD'];