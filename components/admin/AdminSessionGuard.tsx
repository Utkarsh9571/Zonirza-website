'use client';

import { useEffect, useRef } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export function AdminSessionGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes

  // 1. Handle Inactivity Timeout
  useEffect(() => {
    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        handleLogout('Session expired due to inactivity.');
      }, INACTIVITY_LIMIT);
    };

    // Events to listen for activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    if (status === 'authenticated') {
      resetTimer();
      events.forEach(event => window.addEventListener(event, resetTimer));
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [status]);

  const handleLogout = async (message?: string) => {
    if (message) console.log(message);
    await signOut({ redirect: true, callbackUrl: '/admin/login' });
  };

  return <>{children}</>;
}
