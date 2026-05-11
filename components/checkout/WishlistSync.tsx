'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useWishlistStore } from '@/store/wishlistStore';

/**
 * Synchronizes the global wishlist store with the user's database profile.
 * Place this inside the Providers or RootLayout.
 */
export function WishlistSync() {
  const { status } = useSession();
  const setItems = useWishlistStore((state) => state.setItems);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchWishlist();
    }
  }, [status]);

  const fetchWishlist = async () => {
    try {
      const res = await fetch('/api/user/profile');
      const data = await res.json();
      
      if (data.success && data.user?.wishlist) {
        setItems(data.user.wishlist);
      }
    } catch (error) {
      console.error('Wishlist Hydration Error:', error);
    }
  };

  return null; // This component handles side effects only
}
