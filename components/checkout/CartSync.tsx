'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useCartStore, CartItem } from '@/store/cartStore';
import { useCurrencyStore } from '@/store/currencyStore';

export function CartSync() {
  const { data: session, status } = useSession();
  const { items, setItems, clearCart } = useCartStore();
  const isInitialSync = useRef(true);
  const prevStatus = useRef(status);

  // 1. Handle Login/Logout Transitions
  useEffect(() => {
    // LOGIN: User just logged in
    if (prevStatus.current === 'unauthenticated' && status === 'authenticated') {
      syncFromDB();
    }
    
    // LOGOUT: User just logged out
    if (prevStatus.current === 'authenticated' && status === 'unauthenticated') {
      clearCart();
    }

    prevStatus.current = status;
  }, [status]);

  // 2. Initial Fetch on Mount (if already logged in)
  useEffect(() => {
    if (status === 'authenticated' && isInitialSync.current) {
        syncFromDB();
        isInitialSync.current = false;
    }
  }, [status]);

  // 3. Persist Local Changes to DB (Debounced or simple)
  useEffect(() => {
    if (status === 'authenticated' && !isInitialSync.current) {
      const timer = setTimeout(() => {
        persistToDB({ cart: items });
      }, 1000); // Debounce to prevent too many API calls
      return () => clearTimeout(timer);
    }
  }, [items, status]);

  const syncFromDB = async () => {
    try {
      const res = await fetch('/api/user/profile');
      const data = await res.json();
      if (data.success && data.user) {
        // Sync Cart
        if (data.user.cart) {
          if (items.length > 0) {
              const dbCart: CartItem[] = data.user.cart;
              const mergedCart = [...dbCart];
              
              items.forEach(localItem => {
                  const exists = mergedCart.find(dbItem => dbItem.cartItemId === localItem.cartItemId);
                  if (!exists) {
                      mergedCart.push(localItem);
                  }
              });
              setItems(mergedCart);
              persistToDB({ cart: mergedCart });
          } else {
              setItems(data.user.cart);
          }
        }

        // Sync preferences (including currency)
        if (data.user.preferences?.preferredCurrency) {
          useCurrencyStore.getState().setCurrency(data.user.preferences.preferredCurrency);
        }
      }
    } catch (err) {
      console.error("Sync Fetch Error:", err);
    }
  };

  // Sync currency changes back to DB
  useEffect(() => {
    if (status === 'authenticated') {
      const unsub = useCurrencyStore.subscribe((state, prevState) => {
        if (state.currentCurrency !== prevState.currentCurrency) {
          persistToDB({ 
            preferences: { 
              ...state, // Note: this might need careful mapping if store state is complex
              preferredCurrency: state.currentCurrency 
            } 
          });
        }
      });
      return unsub;
    }
  }, [status]);

  const persistToDB = async (data: any) => {
    try {
      await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.error("Data Persist Error:", err);
    }
  };

  return null; // This component doesn't render anything
}
