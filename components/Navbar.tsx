'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, Search, ShoppingCart } from 'lucide-react';
import { MegaMenu } from './MegaMenu';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle
    const [isMegaMenuHovered, setIsMegaMenuHovered] = useState(false);
    const [isMegaMenuPinned, setIsMegaMenuPinned] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
  
    const cartItems = useCartStore((state) => state.items);
    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
    // MegaMenu is open if hovered OR pinned (clicked)
    const isMegaMenuOpen = isMegaMenuHovered || isMegaMenuPinned;
    const navRef = useRef<HTMLElement>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
    const handleMouseEnter = () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      setIsMegaMenuHovered(true);
    };
  
    const handleMouseLeave = () => {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsMegaMenuHovered(false);
      }, 300); // Increased delay for better mobile/tablet transition
    };

    const toggleMegaMenu = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsMegaMenuPinned(!isMegaMenuPinned);
      if (!isMegaMenuPinned) {
        setIsMegaMenuHovered(true); // Ensure it shows immediately on click
      }
    };
  
    // Close mega menu when clicking outside
    useEffect(() => {
      setIsMounted(true);
      const handleClickOutside = (event: MouseEvent) => {
        if (navRef.current && !navRef.current.contains(event.target as Node)) {
          setIsMegaMenuPinned(false);
          setIsMegaMenuHovered(false);
        }
      };
      const handleScroll = () => {
        if (window.scrollY > 50) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
        // Auto-close menu on scroll to improve mobile experience
        if (window.scrollY > 100) {
          setIsMegaMenuPinned(false);
          setIsMegaMenuHovered(false);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener('scroll', handleScroll);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);
  
    return (
      <nav ref={navRef} className={cn(
        "fixed w-full z-[100] flex justify-between items-center transition-all duration-500",
        isScrolled 
          ? "top-0 py-4 px-6 md:px-12 bg-white/60 backdrop-blur-md shadow-sm border-b border-white/20" 
          : "top-6 px-6 md:px-12"
      )}>
        
        {/* 1. LEFT: Floating Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 flex items-center justify-center bg-brand-gold rounded-full text-white shadow-soft">
            <span className="font-serif font-bold text-xl">Z</span>
          </div>
          <span className="text-3xl font-serif font-bold tracking-widest text-brand-text uppercase drop-shadow-md hidden sm:block">Zoniraz</span>
        </Link>
  
        {/* 2. RIGHT: Floating Pill Navbar */}
        <div className="hidden md:flex items-center bg-white/95 backdrop-blur-md rounded-full shadow-premium border border-white/40 pl-8 pr-3 py-3 relative">
          
          {/* Navigation Links inside Pill */}
          <div className="flex items-center space-x-8 mr-8">
            <button 
              className="flex items-center space-x-1 cursor-pointer group py-2 focus:outline-none"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={toggleMegaMenu}
              aria-expanded={isMegaMenuOpen}
            >
              <span className="text-[11px] uppercase tracking-widest font-bold text-brand-text group-hover:text-brand-gold transition-colors">Shop</span>
              <ChevronDown size={14} className={cn("text-brand-text transition-transform", isMegaMenuOpen ? "rotate-180" : "")} />
            </button>
            <Link href="/new-arrivals" className="text-[11px] uppercase tracking-widest font-bold text-brand-text/70 hover:text-brand-gold transition-colors">New Arrivals</Link>
            <Link href="/ready-to-ship" className="text-[11px] uppercase tracking-widest font-bold text-brand-text/70 hover:text-brand-gold transition-colors">Ready to Ship</Link>
            <Link href="/offers" className="text-[11px] uppercase tracking-widest font-bold text-brand-text/70 hover:text-brand-gold transition-colors">Offers</Link>
          </div>
  
          {/* User Actions inside Pill */}
          <div className="flex items-center space-x-6 border-l border-brand-text/10 pl-6">
            <div className="flex items-center space-x-3 text-[10px] uppercase tracking-widest font-bold text-brand-text/70">
              <Link href="/login" className="hover:text-brand-gold transition-colors min-h-[44px] flex items-center">Login</Link>
              <span className="text-brand-text/30">|</span>
              <Link href="/signup" className="hover:text-brand-gold transition-colors min-h-[44px] flex items-center">Sign Up</Link>
            </div>
            
            <button className="flex items-center space-x-1 cursor-pointer min-h-[44px]">
              <span className="text-[10px] uppercase tracking-widest font-bold text-brand-text">IND</span>
              <ChevronDown size={12} className="text-brand-text" />
            </button>
  
            <div className="flex items-center space-x-3 pl-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-bg text-brand-text hover:bg-brand-gold hover:text-white transition-colors" aria-label="Search">
                <Search size={16} />
              </button>
              <Link href="/cart" className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-text text-white hover:bg-brand-gold transition-colors relative shadow-soft" aria-label="Cart">
                <ShoppingCart size={16} />
                {isMounted && totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-brand-gold text-white text-[8px] flex items-center justify-center font-bold">
                    {totalQuantity}
                  </span>
                )}
              </Link>
            </div>
          </div>
  
        </div>
  
        {/* 3. MEGA MENU INTEGRATION (Full Width) */}
        {isMegaMenuOpen && (
          <div 
            className="absolute top-full left-0 w-full pt-4 flex justify-center px-6"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="w-full max-w-[1500px] shadow-premium rounded-[40px]">
              <MegaMenu 
                isOpen={isMegaMenuOpen} 
                onMouseEnter={() => setIsMegaMenuHovered(true)} 
                onMouseLeave={() => setIsMegaMenuHovered(false)}
                onClose={() => {
                  setIsMegaMenuPinned(false);
                  setIsMegaMenuHovered(false);
                }}
              />
            </div>
          </div>
        )}

      {/* Mobile Menu Toggle */}
      <button className="md:hidden w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full shadow-premium text-brand-text border border-white/40" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* MOBILE ACCORDION MENU */}
      {isOpen && (
        <div className="md:hidden absolute top-24 left-6 right-6 bg-white/95 backdrop-blur-md rounded-[30px] border border-white/40 shadow-premium z-40 max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col py-6 px-8 space-y-4">
            <div className="flex flex-col space-y-2 pb-4 border-b border-brand-text/5">
              <div 
                className="flex items-center justify-between text-sm uppercase tracking-widest font-bold text-brand-text py-2"
                onClick={() => setIsMegaMenuPinned(!isMegaMenuPinned)}
              >
                <span>Shop Categories</span>
                <ChevronDown size={16} className={cn("transition-transform", isMegaMenuOpen ? "rotate-180" : "")} />
              </div>
              
              {/* Mobile Mega Menu Accordion Content */}
              {isMegaMenuOpen && (
                <div className="pl-4 flex flex-col space-y-4 py-4 bg-brand-bg rounded-2xl">
                  {['Diamond', 'Solitaire', 'Gemstone', 'Plain Gold', 'Gift', 'Rings', 'Earrings', 'Pendants', 'Bracelets'].map(cat => (
                    <Link key={cat} href={`/category/${cat.toLowerCase()}`} className="text-[11px] font-bold uppercase tracking-widest text-brand-text/70 hover:text-brand-gold">
                      {cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/new-arrivals" className="text-sm uppercase tracking-widest font-bold text-brand-text py-2">New Arrivals</Link>
            <Link href="/ready-to-ship" className="text-sm uppercase tracking-widest font-bold text-brand-text py-2">Ready to Ship</Link>
            <Link href="/offers" className="text-sm uppercase tracking-widest font-bold text-brand-text py-2 border-b border-brand-text/5 pb-6">Offers</Link>
            
            <div className="flex items-center space-x-4 pt-4">
              <Link href="/login" className="text-xs uppercase tracking-widest font-bold text-brand-text hover:text-brand-gold">Login</Link>
              <span className="text-brand-text/20">|</span>
              <Link href="/signup" className="text-xs uppercase tracking-widest font-bold text-brand-text hover:text-brand-gold">Sign Up</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
