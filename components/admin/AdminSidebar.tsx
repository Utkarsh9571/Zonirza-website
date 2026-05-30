'use client';

import { useState, useEffect } from 'react';
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
  Coins,
  Menu,
  X,
  Gift
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
  { icon: Gift, label: 'Gift Cards', href: '/admin/gift-cards' },
  { icon: Briefcase, label: 'Franchise Leads', href: '/admin/franchise-leads' },
  { icon: Monitor, label: 'Merchandising', href: '/admin/merchandising' },
  { icon: Monitor, label: 'Cinematic Hero', href: '/admin/hero' },
  { icon: Coins, label: 'Digi Gold', href: '/admin/digi-gold' },
  { icon: Sparkles, label: 'Exchange Leads', href: '/admin/exchange' },
  { icon: Coins, label: 'Sell Gold Leads', href: '/admin/sell-gold' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on mobile when navigating
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#1a1614] border-b border-white/5 z-40 flex items-center justify-between px-6">
        <Link href="/admin" className="flex items-center space-x-2">
          <Sparkles className="text-brand-gold" size={16} />
          <span className="text-white font-serif tracking-widest uppercase italic text-sm">Zoniraz Admin</span>
        </Link>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 -mr-2 text-brand-gold hover:text-white transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={cn(
        "fixed left-0 top-0 h-screen w-72 bg-[#1a1614] border-r border-white/5 flex flex-col z-50 transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
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
    </>
  );
}
