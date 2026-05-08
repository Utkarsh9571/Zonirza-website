'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useCartStore, CartItem } from '@/store/cartStore';

export function CartSync() {
  const { data: session, status } = useSession();
  const { items, setItems, clearCart } = useCartStore();
  const isInitialSync = useRef(true);
  const prevStatus = useRef(status);

  // 1. Handle Login/Logout Transitions
  useEffect(() => {
    // LOGIN: User just logged in
    if (prevStatus.current === 'unauthenticated' && status === 'authenticated') {
      syncCartFromDB();
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
        syncCartFromDB();
        isInitialSync.current = false;
    }
  }, [status]);

  // 3. Persist Local Changes to DB (Debounced or simple)
  useEffect(() => {
    if (status === 'authenticated' && !isInitialSync.current) {
      const timer = setTimeout(() => {
        persistCartToDB(items);
      }, 1000); // Debounce to prevent too many API calls
      return () => clearTimeout(timer);
    }
  }, [items, status]);

  const syncCartFromDB = async () => {
    try {
      const res = await fetch('/api/user/profile');
      const data = await res.json();
      if (data.success && data.user.cart) {
        // If local cart has items, we might want to merge them or just take DB
        // For Zoniraz luxury, we'll take the DB cart as the source of truth,
        // or merge if local is newer (for now, let's take DB to prevent ghost items)
        if (items.length > 0) {
            // MERGE LOGIC: Add local items to DB items if they don't exist
            const dbCart: CartItem[] = data.user.cart;
            const mergedCart = [...dbCart];
            
            items.forEach(localItem => {
                const exists = mergedCart.find(dbItem => dbItem.cartItemId === localItem.cartItemId);
                if (!exists) {
                    mergedCart.push(localItem);
                }
            });
            setItems(mergedCart);
            persistCartToDB(mergedCart);
        } else {
            setItems(data.user.cart);
        }
      }
    } catch (err) {
      console.error("Cart Sync Fetch Error:", err);
    }
  };

  const persistCartToDB = async (cartItems: CartItem[]) => {
    try {
      await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: cartItems })
      });
    } catch (err) {
      console.error("Cart Persist Error:", err);
    }
  };

  return null; // This component doesn't render anything
}
