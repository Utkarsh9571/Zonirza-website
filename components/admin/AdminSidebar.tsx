'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut,
  ChevronRight,
  Sparkles,
  Tag,
  Layers,
  Ticket,
  Briefcase,
  Monitor,
  Coins
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Overview', href: '/admin' },
  { icon: Package, label: 'Products', href: '/admin/products' },
  { icon: ShoppingBag, label: 'Orders', href: '/admin/orders' },
  { icon: Tag, label: 'Categories', href: '/admin/categories' },
  { icon: Users, label: 'Customers', href: '/admin/customers' },
  { icon: Layers, label: 'Collections', href: '/admin/collections' },
  { icon: Ticket, label: 'Coupons', href: '/admin/coupons' },
  { icon: Briefcase, label: 'Franchise Leads', href: '/admin/franchise-leads' },
  { icon: Monitor, label: 'Merchandising', href: '/admin/merchandising' },
  { icon: Coins, label: 'Digi Gold', href: '/admin/digi-gold' },
  { icon: Sparkles, label: 'Exchange Leads', href: '/admin/exchange' },
  { icon: Coins, label: 'Sell Gold Leads', href: '/admin/sell-gold' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-[#1a1614] border-r border-white/5 flex flex-col z-50">
      {/* Brand Header */}
      <div className="p-8 border-b border-white/5">
        <Link href="/admin" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold to-[#B4925A] flex items-center justify-center shadow-premium group-hover:scale-105 transition-transform duration-500">
            <Sparkles className="text-[#1a1614]" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-serif text-lg tracking-widest uppercase italic">Zoniraz</span>
            <span className="text-brand-gold text-[10px] uppercase tracking-[0.3em] font-bold">Admin Portal</span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-500 w-full text-left",
                isActive 
                  ? "bg-brand-gold/10 text-brand-gold cursor-default" 
                  : "text-brand-gold hover:text-white hover:bg-white/5"
              )}
            >
              <div className="flex items-center space-x-4">
                <item.icon size={20} className={cn(
                  "transition-colors duration-500",
                  isActive ? "text-brand-gold" : "group-hover:text-brand-gold"
                )} />
                <span className="text-[13px] font-medium tracking-wide">{item.label}</span>
              </div>
              {isActive && <div className="w-1 h-4 bg-brand-gold rounded-full" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-6 border-t border-white/5">
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center space-x-4 px-4 py-4 w-full text-brand-gold hover:text-red-400 hover:bg-red-400/5 rounded-2xl transition-all duration-500 group"
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          <span className="text-[13px] font-medium tracking-wide">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
