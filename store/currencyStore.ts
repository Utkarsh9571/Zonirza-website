import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CurrencyCode = 'INR' | 'USD' | 'AED' | 'EUR';

interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
};

// Internal exchange rates (Base: INR)
// In a production app, these would be fetched from an API
const DEFAULT_RATES: Record<CurrencyCode, number> = {
  INR: 1,
  USD: 0.012,  // 1 INR = 0.012 USD
  AED: 0.044,  // 1 INR = 0.044 AED
  EUR: 0.011,  // 1 INR = 0.011 EUR
};

interface CurrencyStore {
  currentCurrency: CurrencyCode;
  rates: Record<CurrencyCode, number>;
  setCurrency: (code: CurrencyCode) => void;
  getCurrencyInfo: () => CurrencyInfo;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      currentCurrency: 'INR',
      rates: DEFAULT_RATES,
      setCurrency: (code) => set({ currentCurrency: code }),
      getCurrencyInfo: () => CURRENCIES[get().currentCurrency],
    }),
    {
      name: 'jewelry-starter-currency',
    }
  )
);
