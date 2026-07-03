import { create } from 'zustand';

interface PricingStore {
  pricingFactors: any;
  loading: boolean;
  error: string | null;
  fetchPricingFactors: () => Promise<void>;
}

export const usePricingStore = create<PricingStore>((set, get) => ({
  pricingFactors: null,
  loading: false,
  error: null,
  fetchPricingFactors: async () => {
    // Avoid redundant fetches if factors are already loaded or currently loading
    if (get().pricingFactors || get().loading) return;

    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/settings/public');
      const data = await res.json();
      if (data.success) {
        set({ pricingFactors: data.data?.pricingFactors || null, loading: false });
      } else {
        set({ error: data.message || 'Failed to fetch pricing factors', loading: false });
      }
    } catch (err: any) {
      set({ error: err.message || 'Network error fetching pricing factors', loading: false });
    }
  }
}));
