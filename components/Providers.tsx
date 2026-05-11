'use client';

import { SessionProvider } from "next-auth/react";
import { CartSync } from "./checkout/CartSync";
import { WishlistSync } from "./checkout/WishlistSync";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartSync />
      <WishlistSync />
      {children}
    </SessionProvider>
  );
}
