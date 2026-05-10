'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { Menu, X, ChevronDown, Search, ShoppingCart, User, LogIn, UserPlus, Gift, MessageSquare, LogOut, Package, MapPin as MapPinIcon, UserCircle } from 'lucide-react';
import { MegaMenu } from './MegaMenu';
import { AuthModal } from './auth/AuthModal';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useAuthModalStore } from '@/store/authModalStore';
import { NAVIGATION_DATA } from '@/constants/navigation';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { resolveProductImage } from '@/lib/imageResolver';

const Navbar = () => {
    const { data: session, status } = useSession();
    const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle
    const [isMegaMenuHovered, setIsMegaMenuHovered] = useState(false);
    const [isMegaMenuPinned, setIsMegaMenuPinned] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { isOpen: isAuthModalOpen, openAuthModal, closeAuthModal } = useAuthModalStore();
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);
    const cartItems = useCartStore((state) => state.items);
    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const isLoggedIn = status === 'authenticated';
  
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
          setIsUserDropdownOpen(false);
        }
        if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
          setIsSearchOpen(false);
        }
      };

      let rafId: number;
      const handleScroll = () => {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        if (scrollY > 20) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
        
        rafId = requestAnimationFrame(handleScroll);
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      rafId = requestAnimationFrame(handleScroll);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        cancelAnimationFrame(rafId);
      };
    }, []);
  
    // Debounced Search Effect
    useEffect(() => {
      const timer = setTimeout(async () => {
        if (searchQuery.length >= 2) {
          setIsSearchLoading(true);
          try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=5`);
            const data = await res.json();
            if (data.success) {
              setSearchResults(data.data);
            }
          } catch (error) {
            console.error('Search error:', error);
          } finally {
            setIsSearchLoading(false);
          }
        } else {
          setSearchResults([]);
        }
      }, 300);

      return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        setIsSearchOpen(false);
      }
    };

    return (
      <>
      <nav ref={navRef} className={cn(
        "fixed w-full z-[100] flex justify-between items-center transition-all duration-500",
        isScrolled 
          ? "top-0 py-4 px-6 md:px-12 bg-white/70 backdrop-blur-xl shadow-sm border-b border-white/20" 
          : "top-0 py-6 px-6 md:px-12 bg-transparent"
      )}>
        
        {/* 1. LEFT: Floating Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 flex items-center justify-center bg-brand-gold rounded-full text-white shadow-soft">
            <span className="font-serif font-bold text-xl">Z</span>
          </div>
          <span className="text-3xl font-serif font-bold tracking-widest text-brand-text uppercase drop-shadow-md hidden sm:block">Zoniraz</span>
        </Link>
  
        {/* 2. RIGHT: Floating Pill Navbar - Expanded for Search */}
        <div className="hidden md:flex items-center bg-white/95 backdrop-blur-md rounded-full shadow-premium border border-white/40 pl-4 pr-3 py-2.5 relative">
          
          {/* SEARCH BAR INTEGRATED ON LEFT OF PILL */}
          <div ref={searchRef} className="relative flex items-center mr-6 border-r border-brand-text/5 pr-6">
            <div className={cn(
              "flex items-center bg-brand-bg/50 rounded-full transition-all duration-500 overflow-hidden px-4 py-2",
              isSearchOpen || searchQuery ? "w-[280px] ring-1 ring-brand-gold/20" : "w-[180px]"
            )}>
              <Search size={14} className="text-brand-gold flex-shrink-0" />
              <form onSubmit={handleSearchSubmit} className="flex-1 ml-2">
                <input 
                  type="text"
                  placeholder="Find masterpieces..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-[11px] font-bold uppercase tracking-widest text-brand-text placeholder:text-brand-text/30"
                />
              </form>
              {isSearchLoading && <div className="w-3 h-3 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />}
            </div>

            {/* LIVE SUGGESTIONS DROPDOWN */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 mt-4 w-[350px] bg-white rounded-[24px] shadow-premium border border-brand-text/5 p-4 animate-in fade-in slide-in-from-top-2 duration-300 z-[120]">
                <p className="text-[9px] uppercase tracking-widest font-black text-brand-text/30 px-3 mb-4">Quick Results</p>
                <div className="space-y-1">
                  {searchResults.map((product) => (
                    <Link 
                      key={product.slug}
                      href={`/product/${product.slug}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center space-x-4 p-3 rounded-xl hover:bg-brand-bg transition-all group"
                    >
                      <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-brand-bg flex-shrink-0">
                        <Image src={resolveProductImage(product.images?.[0])} alt={product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-brand-text truncate group-hover:text-brand-gold transition-colors">{product.name}</p>
                        <p className="text-[9px] text-brand-text/40 uppercase tracking-tighter">₹{product.basePrice?.toLocaleString()}</p>
                      </div>
                    </Link>
                  ))}
                  <button 
                    onClick={handleSearchSubmit}
                    className="w-full py-3 mt-2 text-[9px] font-black uppercase tracking-widest text-brand-gold hover:bg-brand-gold hover:text-white rounded-xl transition-all border border-brand-gold/10"
                  >
                    View All Results
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links inside Pill */}
          <div className="flex items-center space-x-8 mr-8">
            <button 
              className={cn(
                "flex items-center space-x-1 cursor-pointer group py-2 focus:outline-none touch-safe-hit transition-all",
                isMegaMenuOpen ? "text-brand-gold" : "text-brand-text"
              )}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={toggleMegaMenu}
              aria-expanded={isMegaMenuOpen}
            >
              <span className="text-[11px] uppercase tracking-widest font-bold group-hover:text-brand-gold transition-colors">Shop</span>
              <ChevronDown size={14} className={cn("transition-transform duration-300", isMegaMenuOpen ? "rotate-180 text-brand-gold" : "text-brand-text")} />
            </button>
            <Link href="/new-arrivals" className="text-[11px] uppercase tracking-widest font-bold text-brand-text/70 hover:text-brand-gold transition-colors">New Arrivals</Link>
            <Link href="/blog" className="text-[11px] uppercase tracking-widest font-bold text-brand-text/70 hover:text-brand-gold transition-colors">Blog</Link>
            <Link href="/contact" className="text-[11px] uppercase tracking-widest font-bold text-brand-text/70 hover:text-brand-gold transition-colors">Contact Us</Link>
          </div>
  
          {/* User Actions inside Pill */}
          <div className="flex items-center space-x-6 border-l border-brand-text/10 pl-6">
            {/* 3. Account Dropdown & Trigger */}
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsUserDropdownOpen(!isUserDropdownOpen);
                  setIsMegaMenuPinned(false); // Close other menus
                }}
                className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-full transition-all shadow-soft relative overflow-hidden touch-safe-hit",
                  isLoggedIn ? "bg-brand-text text-white" : "bg-brand-bg text-brand-text active:bg-brand-gold active:text-white"
                )}
                aria-label="Account"
              >
                {isLoggedIn ? <div className="text-[10px] font-bold uppercase tracking-tighter">{session.user?.name?.charAt(0) || 'U'}</div> : <User size={18} />}
              </button>

              {/* Account Dropdown */}
              {isUserDropdownOpen && (
                <div className="absolute top-full right-0 mt-4 w-72 bg-white rounded-[32px] shadow-premium border border-brand-text/5 p-4 animate-in fade-in slide-in-from-top-2 duration-500 z-50">
                   <div className="space-y-1">
                      {isLoggedIn ? (
                        <>
                          <div className="px-4 py-6 border-b border-brand-text/5 mb-2">
                            <p className="text-[10px] uppercase tracking-widest text-brand-text/40 font-bold mb-1">Authenticated</p>
                            <p className="text-sm font-serif text-brand-text italic truncate">{session.user?.name || 'Valued Customer'}</p>
                          </div>
                          
                          <Link 
                            href="/account"
                            className="w-full flex items-center space-x-4 p-4 rounded-2xl hover:bg-brand-bg text-brand-text transition-all group"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-text/40 group-hover:text-brand-gold shadow-soft transition-all">
                              <UserCircle size={18} />
                            </div>
                            <p className="text-[11px] font-bold uppercase tracking-widest">My Profile</p>
                          </Link>

                          <Link 
                            href="/account?tab=orders"
                            className="w-full flex items-center space-x-4 p-4 rounded-2xl hover:bg-brand-bg text-brand-text transition-all group"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-text/40 group-hover:text-brand-gold shadow-soft transition-all">
                              <Package size={18} />
                            </div>
                            <p className="text-[11px] font-bold uppercase tracking-widest">My Orders</p>
                          </Link>

                          <Link 
                            href="/account?tab=addresses"
                            className="w-full flex items-center space-x-4 p-4 rounded-2xl hover:bg-brand-bg text-brand-text transition-all group"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-text/40 group-hover:text-brand-gold shadow-soft transition-all">
                              <MapPinIcon size={18} />
                            </div>
                            <p className="text-[11px] font-bold uppercase tracking-widest">Saved Addresses</p>
                          </Link>

                          <button 
                            onClick={() => {
                              signOut();
                              setIsUserDropdownOpen(false);
                            }}
                            className="w-full flex items-center space-x-4 p-4 rounded-2xl hover:bg-red-50 text-brand-text hover:text-red-600 transition-all group"
                          >
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-text/40 group-hover:text-red-500 shadow-soft transition-all">
                              <LogOut size={18} />
                            </div>
                            <p className="text-[11px] font-bold uppercase tracking-widest">Logout</p>
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => {
                              openAuthModal();
                              setIsUserDropdownOpen(false);
                            }}
                            className="w-full flex items-center space-x-4 p-6 rounded-2xl bg-brand-bg hover:bg-brand-gold hover:text-white text-brand-text transition-all group"
                          >
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-text/40 group-hover:text-brand-gold shadow-soft transition-all">
                              <Gift size={20} />
                            </div>
                            <div className="text-left">
                              <p className="text-[11px] font-bold uppercase tracking-widest">Log in / Sign up</p>
                              <p className="text-[8px] uppercase tracking-widest text-brand-text/40 group-hover:text-white/60">Unlock Privileges</p>
                            </div>
                          </button>

                          <Link 
                            href="/contact"
                            className="w-full flex items-center space-x-4 p-4 rounded-2xl hover:bg-brand-bg text-brand-text transition-all group mt-2"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-text/40 group-hover:text-brand-gold shadow-soft transition-all">
                              <MessageSquare size={18} />
                            </div>
                            <p className="text-[11px] font-bold uppercase tracking-widest">Contact Us</p>
                          </Link>
                        </>
                      )}
                   </div>
                </div>
              )}
            </div>
            
            <button className="flex items-center space-x-1 cursor-pointer min-h-[44px]">
              <span className="text-[10px] uppercase tracking-widest font-bold text-brand-text">IND</span>
              <ChevronDown size={12} className="text-brand-text" />
            </button>
  
            <div className="flex items-center space-x-3 pl-2">
              <Link href="/cart" className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-text text-white active:bg-brand-gold transition-colors relative shadow-soft touch-safe-hit" aria-label="Cart">
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
            className={cn(
              "left-0 w-full pt-4 flex justify-center px-6 animate-in slide-in-from-top-2 duration-300 z-[110]",
              isScrolled ? "fixed top-16" : "absolute top-full"
            )}
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
                <div className="pl-2 flex flex-col space-y-2 py-4">
                  {NAVIGATION_DATA.map((cat) => (
                    <div key={cat.id} className="flex flex-col">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-brand-bg/50 border border-brand-text/5">
                        <Link 
                          href={cat.href}
                          className="text-[11px] font-bold uppercase tracking-widest text-brand-text/80"
                          onClick={() => setIsOpen(false)}
                        >
                          {cat.name}
                        </Link>
                        {/* No nested accordion for mobile to keep it simple, or add a toggle if needed */}
                      </div>
                      
                      {/* Sub-links for mobile */}
                      <div className="grid grid-cols-2 gap-2 mt-2 pl-2">
                        {cat.subCategories.slice(0, 4).map((sub, sIdx) => (
                          <Link 
                            key={sIdx}
                            href={sub.href}
                            className="p-2 text-[9px] uppercase font-bold tracking-tighter text-brand-text/50 bg-white/50 rounded-lg border border-brand-text/5"
                            onClick={() => setIsOpen(false)}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link href="/new-arrivals" className="text-sm uppercase tracking-widest font-bold text-brand-text py-2">New Arrivals</Link>
            <Link href="/blog" className="text-sm uppercase tracking-widest font-bold text-brand-text py-2">Blog</Link>
            <Link href="/contact" onClick={() => setIsOpen(false)} className="text-sm uppercase tracking-widest font-bold text-brand-text py-2 border-b border-brand-text/5 pb-6">Contact Us</Link>
            
            <div className="pt-6 border-t border-brand-text/5 space-y-4">
              <button 
                onClick={() => {
                  setIsSearchOpen(true);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-3 p-5 rounded-2xl bg-brand-bg text-brand-text font-bold uppercase tracking-widest text-[11px] border border-brand-text/5 hover:bg-brand-gold hover:text-white transition-all duration-300"
              >
                <Search size={18} />
                <span>Search Masterpieces</span>
              </button>

              <button 
                onClick={() => {
                  openAuthModal();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-3 p-5 rounded-2xl bg-brand-text text-white font-bold uppercase tracking-widest text-[11px] border border-brand-text hover:bg-transparent hover:text-brand-text transition-all duration-300"
              >
                <User size={18} />
                <span>Login / Sign Up</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
    <AuthModal 
      isOpen={isAuthModalOpen} 
      onClose={closeAuthModal} 
    />
    </>
  );
};

export default Navbar;
