'use client';

import { SessionProvider } from "next-auth/react";
import { CartSync } from "./checkout/CartSync";
import { WishlistSync } from "./checkout/WishlistSync";
import { ThemeManager } from "./ThemeManager";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeManager />
      <CartSync />
      <WishlistSync />
      {children}
    </SessionProvider>
  );
}
