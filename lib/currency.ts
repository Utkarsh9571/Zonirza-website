import { CurrencyCode } from '@/store/currencyStore';

/**
 * Formats a numeric price into a localized luxury currency string.
 * Uses Intl.NumberFormat for precision and localized symbols.
 */
export const formatPrice = (amount: number, currencyCode: CurrencyCode): string => {
  // Custom formatting for AED since standard Intl can be inconsistent across browsers
  if (currencyCode === 'AED') {
    return `AED ${new Intl.NumberFormat('en-AE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)}`;
  }

  return new Intl.NumberFormat(currencyCode === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: currencyCode === 'INR' ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Converts a base price (INR) to the target currency using the provided rates.
 */
export const convertPrice = (
  amountInINR: number,
  targetCurrency: CurrencyCode,
  rates: Record<CurrencyCode, number> = { INR: 1, USD: 0.012, AED: 0.044, EUR: 0.011 }
): number => {
  const rate = (rates && rates[targetCurrency]) || 1;
  return amountInINR * rate;
};

/**
 * Helper to perform both conversion and formatting in one step.
 */
export const displayPrice = (
  amountInINR: number,
  targetCurrency: CurrencyCode,
  rates: Record<CurrencyCode, number> = { INR: 1, USD: 0.012, AED: 0.044, EUR: 0.011 }
): string => {
  const converted = convertPrice(amountInINR, targetCurrency, rates);
  return formatPrice(converted, targetCurrency);
};
