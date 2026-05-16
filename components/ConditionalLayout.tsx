'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Define routes that should NOT have the storefront Navbar and Footer
  const isAdminPath = pathname?.startsWith('/admin');
  const isOnboardingPath = pathname?.startsWith('/onboarding');
  
  if (isAdminPath || isOnboardingPath) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
