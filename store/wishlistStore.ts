import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  items: string[]; // Array of product slugs
  addItem: (slug: string) => void;
  removeItem: (slug: string) => void;
  toggleItem: (slug: string) => void;
  setItems: (items: string[]) => void;
  isInWishlist: (slug: string) => boolean;
  syncWithDB: () => Promise<void>;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (slug) => {
        if (!get().items.includes(slug)) {
          set({ items: [...get().items, slug] });
          get().syncWithDB();
        }
      },

      removeItem: (slug) => {
        set({ items: get().items.filter((item) => item !== slug) });
        get().syncWithDB();
      },

      toggleItem: (slug) => {
        if (get().items.includes(slug)) {
          get().removeItem(slug);
        } else {
          get().addItem(slug);
        }
      },

      setItems: (items) => set({ items }),

      isInWishlist: (slug) => get().items.includes(slug),

      syncWithDB: async () => {
        try {
          const items = get().items;
          // Only sync if user is logged in (session check is usually in the API or component)
          await fetch('/api/user/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wishlist: items })
          });
        } catch (error) {
          console.error('Wishlist Sync Error:', error);
        }
      }
    }),
    {
      name: 'jewelry-starter-wishlist',
    }
  )
);
