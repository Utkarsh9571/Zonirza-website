'use client';

import { SessionProvider } from "next-auth/react";
import { CartSync } from "./checkout/CartSync";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartSync />
      {children}
    </SessionProvider>
  );
}
