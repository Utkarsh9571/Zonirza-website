'use client';

import { 
  Bell, 
  Search, 
  User, 
  Moon, 
  Sun,
  Globe,
  ExternalLink
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export function AdminTopbar() {
  const { data: session } = useSession();

  return (
    <header className="h-20 bg-white/80 dark:bg-[#1a1614]/80 backdrop-blur-xl border-b border-brand-text/5 dark:border-white/5 px-8 flex items-center justify-between sticky top-0 z-40 transition-colors duration-500">
      {/* Search Bar */}
      <div className="relative w-96 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/30 group-focus-within:text-brand-gold transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search products, orders, customers..." 
          className="w-full bg-brand-bg dark:bg-white/5 border-none rounded-2xl py-3 pl-12 pr-4 text-[13px] focus:ring-1 focus:ring-brand-gold/50 transition-all placeholder:text-brand-text/20 dark:placeholder:text-white/20"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-6">
        {/* View Storefront */}
        <Link 
          href="/" 
          target="_blank"
          className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-brand-text/40 hover:text-brand-gold transition-colors"
        >
          <span>Storefront</span>
          <ExternalLink size={14} />
        </Link>

        {/* Notifications */}
        <button className="relative w-10 h-10 rounded-full bg-brand-bg dark:bg-white/5 flex items-center justify-center text-brand-text/40 hover:text-brand-gold transition-colors group">
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-gold rounded-full border-2 border-white dark:border-[#1a1614]" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-brand-text/5 dark:bg-white/5" />

        {/* User Profile */}
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-[13px] font-bold text-brand-text dark:text-white leading-none">
              {session?.user?.name || 'Admin'}
            </p>
            <p className="text-[10px] text-brand-gold uppercase tracking-widest font-black mt-1">
              Superuser
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-gold/20 to-brand-gold/40 border border-brand-gold/20 flex items-center justify-center text-brand-gold">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
