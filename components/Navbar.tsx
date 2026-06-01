'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { Menu, X, ChevronDown, Search, ShoppingCart, User, LogIn, UserPlus, Gift, MessageSquare, LogOut, Package, MapPin as MapPinIcon, UserCircle, ArrowRight, Heart, Moon, Sun, ShieldCheck, Ticket } from 'lucide-react';
import { MegaMenu } from './MegaMenu';
import { AuthModal } from './auth/AuthModal';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useAuthModalStore } from '@/store/authModalStore';
import { NAVIGATION_DATA } from '@/constants/navigation';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { resolveProductImage } from '@/lib/imageResolver';
import { useCurrencyStore, CURRENCIES, CurrencyCode } from '@/store/currencyStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useThemeStore } from '@/store/themeStore';

const Navbar = () => {
    const { data: session, status } = useSession();
    const [isOpen, setIsOpen] = useState(false); // Mobile hamburger menu
    const [isMounted, setIsMounted] = useState(false);
    
    // INTERACTION STATE MACHINE
    const [activeMenu, setActiveMenu] = useState<'none' | 'shop' | 'account' | 'search' | 'currency'>('none');
    
    const { currentCurrency, setCurrency } = useCurrencyStore();
    const currencyInfo = CURRENCIES[currentCurrency];
    const [isScrolled, setIsScrolled] = useState(false);
    const { isOpen: isAuthModalOpen, openAuthModal, closeAuthModal } = useAuthModalStore();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);
    const cartItems = useCartStore((state) => state.items);
    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const wishlistItems = useWishlistStore((state) => state.items);
    const wishlistCount = wishlistItems.length;
    const { theme, toggleTheme } = useThemeStore();

    const isLoggedIn = status === 'authenticated';
  
    const navRef = useRef<HTMLElement>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
    // Unified menu control
    const closeAllMenus = () => {
      setActiveMenu('none');
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };

    const handleShopInteraction = (type: 'hover' | 'click') => {
      if (type === 'hover') {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        setActiveMenu('shop');
      } else {
        setActiveMenu(prev => prev === 'shop' ? 'none' : 'shop');
      }
    };

    const handleMouseLeave = () => {
      hoverTimeoutRef.current = setTimeout(() => {
        setActiveMenu(prev => prev === 'shop' ? 'none' : prev);
      }, 300);
    };
  
    // Close menus on outside click/tap
    useEffect(() => {
      setIsMounted(true);
      const handleGlobalInteraction = (event: MouseEvent | TouchEvent) => {
        if (navRef.current && !navRef.current.contains(event.target as Node)) {
          closeAllMenus();
        }
      };

      let rafId: number;
      const handleScroll = () => {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        setIsScrolled(scrollY > 20);
        rafId = requestAnimationFrame(handleScroll);
      };
  
      document.addEventListener("mousedown", handleGlobalInteraction);
      document.addEventListener("touchstart", handleGlobalInteraction);
      rafId = requestAnimationFrame(handleScroll);

      return () => {
        document.removeEventListener("mousedown", handleGlobalInteraction);
        document.removeEventListener("touchstart", handleGlobalInteraction);
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
        setActiveMenu('none');
      }
    };

    return (
      <>
      <nav ref={navRef} className={cn(
        "fixed top-0 left-0 right-0 z-[100] flex justify-between items-center transition-all duration-500 pointer-events-auto",
        isScrolled 
          ? "py-4 px-6 md:px-12 bg-white/90 dark:bg-brand-bg/90 backdrop-blur-xl shadow-premium border-b border-brand-border dark:border-white/5" 
          : "py-6 px-6 md:px-12 bg-transparent"
      )}>
        
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center group relative z-[110] bg-white dark:bg-brand-white/80 backdrop-blur-md px-6 py-4 rounded-full border-2 border-brand-gold shadow-premium transition-all duration-500">
            <div className="relative w-32 md:w-40 h-10 md:h-12">
              <Image 
                src="/images/ZONIRAZ LOGO.png" 
                alt="Zoniraz Logo" 
                fill
                sizes="(max-width: 768px) 128px, 160px"
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>
  
        {/* 2. RIGHT: Floating Pill Navbar */}
        <div className="hidden md:flex items-center bg-white dark:bg-brand-white/80 backdrop-blur-md rounded-full shadow-premium border-2 border-brand-gold pl-4 pr-3 py-2.5 relative transition-colors">
          
          {/* SEARCH BAR */}
          <div ref={searchRef} className="relative flex items-center mr-6 border-r border-brand-border dark:border-white/10 pr-6 transition-colors">
            <div className={cn(
              "flex items-center bg-brand-bg/80 dark:bg-brand-bg rounded-full transition-all duration-500 overflow-hidden px-4 py-2",
              activeMenu === 'search' || searchQuery ? "w-[280px] ring-1 ring-brand-gold/30" : "w-[180px]"
            )}>
              <Search size={14} className="text-brand-gold flex-shrink-0" />
              <form onSubmit={handleSearchSubmit} className="flex-1 ml-2">
                <input 
                  type="text"
                  placeholder="Find masterpieces..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setActiveMenu('search')}
                  className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-[11px] font-bold uppercase tracking-widest text-brand-text dark:text-brand-text/90 placeholder:text-brand-text/30"
                />
              </form>
              {isSearchLoading && <div className="w-3 h-3 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />}
            </div>

            {/* LIVE SUGGESTIONS DROPDOWN */}
            {activeMenu === 'search' && searchResults.length > 0 && (
              <div className="absolute top-full left-0 mt-4 w-[350px] bg-white dark:bg-brand-white rounded-[24px] shadow-premium border border-brand-text/5 dark:border-white/10 p-4 animate-in fade-in slide-in-from-top-2 duration-300 z-[120] transition-colors">
                <p className="text-[9px] uppercase tracking-widest font-black text-brand-text/30 px-3 mb-4">Quick Results</p>
                <div className="space-y-1">
                  {searchResults.map((product) => (
                    <Link 
                      key={product.slug}
                      href={`/product/${product.slug}`}
                      onClick={() => setActiveMenu('none')}
                    className="flex items-center space-x-4 p-3 rounded-xl hover:bg-brand-bg dark:hover:bg-brand-bg/50 text-brand-text dark:text-brand-text transition-all group"
                    >
                      <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-brand-bg dark:bg-brand-bg/50 flex-shrink-0 transition-colors">
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
            <div 
              className="relative py-2"
              onMouseEnter={() => handleShopInteraction('hover')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className={cn(
                  "flex items-center space-x-1 cursor-pointer group focus:outline-none touch-safe-hit transition-all",
                  activeMenu === 'shop' ? "text-brand-gold" : "text-brand-text"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleShopInteraction('click');
                }}
                aria-expanded={activeMenu === 'shop'}
              >
                <span className="text-[11px] uppercase tracking-widest font-bold group-hover:text-brand-gold transition-colors">Shop</span>
                <ChevronDown size={14} className={cn("transition-transform duration-300", activeMenu === 'shop' ? "rotate-180 text-brand-gold" : "text-brand-text")} />
              </button>
            </div>
            
            <Link href="/blog" className="text-[11px] uppercase tracking-widest font-bold text-brand-text/70 dark:text-brand-text/80 hover:text-brand-gold transition-colors">Blog</Link>
            <Link href="/franchise" className="text-[11px] uppercase tracking-widest font-bold text-brand-text/70 dark:text-brand-text/80 hover:text-brand-gold transition-colors">Franchise</Link>
            <Link href="/contact" className="text-[11px] uppercase tracking-widest font-bold text-brand-text/70 dark:text-brand-text/80 hover:text-brand-gold transition-colors">Contact Us</Link>
          </div>
  
          {/* User Actions inside Pill */}
          <div className="flex items-center space-x-6 border-l border-brand-text/10 dark:border-white/10 pl-6 transition-colors">
            
            <Link href="/account?tab=wishlist" className="relative group">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-bg dark:bg-brand-bg text-brand-text dark:text-brand-text active:bg-brand-gold active:text-white transition-all shadow-soft group-hover:text-brand-gold touch-safe-hit">
                <Heart size={18} />
                {isMounted && wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-brand-gold text-white text-[8px] flex items-center justify-center font-bold animate-in zoom-in duration-300">
                    {wishlistCount}
                  </span>
                )}
              </div>
            </Link>

            <div className="relative">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveMenu(prev => prev === 'account' ? 'none' : 'account');
                }}
                className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-full transition-all shadow-soft relative overflow-hidden touch-safe-hit",
                  isLoggedIn ? "bg-brand-text dark:bg-brand-gold text-white" : "bg-brand-bg dark:bg-brand-bg text-brand-text dark:text-brand-text active:bg-brand-gold active:text-white"
                )}
                aria-label="Account"
              >
                {isLoggedIn ? <div className="text-[10px] font-bold uppercase tracking-tighter">{session.user?.name?.charAt(0) || 'U'}</div> : <User size={18} />}
              </button>

              {/* Account Dropdown */}
              {activeMenu === 'account' && (
                <div className="absolute top-full right-0 mt-4 w-72 bg-white dark:bg-brand-white rounded-[32px] shadow-premium border border-brand-text/5 dark:border-white/10 p-4 animate-in fade-in slide-in-from-top-2 duration-500 z-50 pointer-events-auto transition-colors">
                   <div className="space-y-1">
                      {isLoggedIn ? (
                        <>
                          <div className="px-4 py-6 border-b border-brand-text/5 mb-2">
                            <p className="text-[10px] uppercase tracking-widest text-brand-text/40 font-bold mb-1">Authenticated</p>
                            <p className="text-sm font-serif text-brand-text italic truncate">{session.user?.name || 'Valued Customer'}</p>
                          </div>
                          
                          <Link href="/account" className="w-full flex items-center space-x-4 p-4 rounded-2xl hover:bg-brand-bg dark:hover:bg-brand-bg/50 text-brand-text dark:text-brand-text transition-all group" onClick={() => setActiveMenu('none')}>
                            <div className="w-8 h-8 rounded-full bg-white dark:bg-brand-bg flex items-center justify-center text-brand-text/40 dark:text-brand-text/60 group-hover:text-brand-gold shadow-soft transition-all"><UserCircle size={18} /></div>
                            <p className="text-[11px] font-bold uppercase tracking-widest">My Profile</p>
                          </Link>

                          <Link href="/account?tab=orders" className="w-full flex items-center space-x-4 p-4 rounded-2xl hover:bg-brand-bg dark:hover:bg-brand-bg/50 text-brand-text dark:text-brand-text transition-all group" onClick={() => setActiveMenu('none')}>
                            <div className="w-8 h-8 rounded-full bg-white dark:bg-brand-bg flex items-center justify-center text-brand-text/40 dark:text-brand-text/60 group-hover:text-brand-gold shadow-soft transition-all"><Package size={18} /></div>
                            <p className="text-[11px] font-bold uppercase tracking-widest">My Orders</p>
                          </Link>

                          <Link href="/account/savings" className="w-full flex items-center space-x-4 p-4 rounded-2xl hover:bg-brand-bg dark:hover:bg-brand-bg/50 text-brand-text dark:text-brand-text transition-all group" onClick={() => setActiveMenu('none')}>
                            <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-white shadow-soft transition-all"><ShieldCheck size={18} /></div>
                            <p className="text-[11px] font-bold uppercase tracking-widest">Savings Plans</p>
                          </Link>

                          <Link href="/account/gift-cards" className="w-full flex items-center space-x-4 p-4 rounded-2xl hover:bg-brand-bg dark:hover:bg-brand-bg/50 text-brand-text dark:text-brand-text transition-all group" onClick={() => setActiveMenu('none')}>
                            <div className="w-8 h-8 rounded-full bg-white dark:bg-brand-bg flex items-center justify-center text-brand-text/40 dark:text-brand-text/60 group-hover:text-brand-gold shadow-soft transition-all"><Gift size={18} /></div>
                            <p className="text-[11px] font-bold uppercase tracking-widest">Gift Cards</p>
                          </Link>

                          <Link href="/account/rewards" className="w-full flex items-center space-x-4 p-4 rounded-2xl hover:bg-brand-bg dark:hover:bg-brand-bg/50 text-brand-text dark:text-brand-text transition-all group" onClick={() => setActiveMenu('none')}>
                            <div className="w-8 h-8 rounded-full bg-white dark:bg-brand-bg flex items-center justify-center text-brand-text/40 dark:text-brand-text/60 group-hover:text-brand-gold shadow-soft transition-all"><Ticket size={18} /></div>
                            <p className="text-[11px] font-bold uppercase tracking-widest">My Rewards</p>
                          </Link>

                          <Link href="/account?tab=addresses" className="w-full flex items-center space-x-4 p-4 rounded-2xl hover:bg-brand-bg dark:hover:bg-brand-bg/50 text-brand-text dark:text-brand-text transition-all group" onClick={() => setActiveMenu('none')}>
                            <div className="w-8 h-8 rounded-full bg-white dark:bg-brand-bg flex items-center justify-center text-brand-text/40 dark:text-brand-text/60 group-hover:text-brand-gold shadow-soft transition-all"><MapPinIcon size={18} /></div>
                            <p className="text-[11px] font-bold uppercase tracking-widest">Saved Addresses</p>
                          </Link>

                          <button onClick={() => { signOut(); setActiveMenu('none'); }} className="w-full flex items-center space-x-4 p-4 rounded-2xl hover:bg-red-50 dark:hover:bg-red-500/10 text-brand-text dark:text-brand-text hover:text-red-600 transition-all group">
                            <div className="w-8 h-8 rounded-full bg-white dark:bg-brand-bg flex items-center justify-center text-brand-text/40 dark:text-brand-text/60 group-hover:text-red-500 shadow-soft transition-all"><LogOut size={18} /></div>
                            <p className="text-[11px] font-bold uppercase tracking-widest">Logout</p>
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { openAuthModal(); setActiveMenu('none'); }} className="w-full flex items-center space-x-4 p-6 rounded-2xl bg-brand-bg dark:bg-brand-bg hover:bg-brand-gold dark:hover:bg-brand-gold hover:text-white text-brand-text transition-all group">
                            <div className="w-8 h-8 rounded-full bg-white dark:bg-brand-bg flex items-center justify-center text-brand-text/40 dark:text-brand-text/60 group-hover:text-brand-gold shadow-soft transition-all"><Gift size={20} /></div>
                            <div className="text-left">
                              <p className="text-[11px] font-bold uppercase tracking-widest">Log in / Sign up</p>
                              <p className="text-[8px] uppercase tracking-widest text-brand-text/40 dark:text-brand-text/60 group-hover:text-white/60">Unlock Privileges</p>
                            </div>
                          </button>
                        </>
                      )}
                   </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveMenu(prev => prev === 'currency' ? 'none' : 'currency');
                }}
                className="flex items-center space-x-1 cursor-pointer min-h-[44px] group touch-safe-hit"
              >
                <span className="text-[10px] uppercase tracking-widest font-black text-brand-text dark:text-brand-text group-hover:text-brand-gold transition-colors">{currentCurrency}</span>
                <ChevronDown size={12} className={cn("text-brand-text dark:text-brand-text transition-transform duration-300", activeMenu === 'currency' ? "rotate-180" : "")} />
              </button>

              {/* Currency Dropdown */}
              {activeMenu === 'currency' && (
                <div className="absolute top-full right-0 mt-4 w-48 bg-white dark:bg-brand-white rounded-[24px] shadow-premium border border-brand-text/5 dark:border-white/10 p-3 animate-in fade-in slide-in-from-top-2 duration-300 z-50 pointer-events-auto transition-colors">
                  <p className="text-[8px] uppercase tracking-widest font-black text-brand-text/30 px-3 mb-3">Select Currency</p>
                  <div className="space-y-1">
                    {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                      <button
                        key={code}
                        onClick={() => {
                          setCurrency(code);
                          setActiveMenu('none');
                        }}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-xl transition-all group",
                          currentCurrency === code ? "bg-brand-bg dark:bg-brand-bg/50 text-brand-text dark:text-brand-text font-bold" : "hover:bg-brand-bg dark:hover:bg-brand-bg/50 text-brand-text/60 dark:text-brand-text/80"
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-sm">{CURRENCIES[code].flag}</span>
                          <span className="text-[10px] uppercase tracking-widest font-bold">{code}</span>
                        </div>
                        {currentCurrency === code && <div className="w-1.5 h-1.5 rounded-full bg-brand-gold shadow-sm" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-bg dark:bg-brand-bg text-brand-text dark:text-brand-text active:bg-brand-gold active:text-white transition-all shadow-soft hover:text-brand-gold touch-safe-hit"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
  
            <div className="flex items-center space-x-3 pl-2">
              <Link href="/cart" className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-text dark:bg-brand-gold text-white active:bg-brand-gold transition-colors relative shadow-soft touch-safe-hit" aria-label="Cart">
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
  
        {/* 3. MEGA MENU INTEGRATION */}
        {activeMenu === 'shop' && (
          <div 
            className={cn(
              "left-0 right-0 flex justify-center px-4 md:px-6 lg:px-12 animate-in slide-in-from-top-2 duration-300 z-[110] pointer-events-auto",
              "absolute top-full"
            )}
            onMouseEnter={() => handleShopInteraction('hover')}
            onMouseLeave={handleMouseLeave}
          >
            <div className="w-full max-w-[1500px] shadow-premium rounded-[40px] pointer-events-auto">
              <MegaMenu 
                isOpen={activeMenu === 'shop'} 
                onMouseEnter={() => handleShopInteraction('hover')} 
                onMouseLeave={handleMouseLeave}
                onClose={() => setActiveMenu('none')}
              />
            </div>
          </div>
        )}

      {/* Mobile Menu Toggle */}
      <button className="md:hidden w-12 h-12 flex items-center justify-center bg-white/90 dark:bg-brand-bg/90 backdrop-blur-md rounded-full shadow-premium text-brand-text dark:text-brand-text/90 border border-white/40 dark:border-white/10 active:scale-90 transition-all" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* MOBILE ACCORDION MENU */}
      {isOpen && (
        <div className="md:hidden absolute top-24 left-6 right-6 bg-white/90 dark:bg-white/90 backdrop-blur-md rounded-[30px] border border-white/40 shadow-premium z-[150] max-h-[80vh] overflow-y-auto pointer-events-auto transition-colors">
          <div className="flex flex-col py-6 px-8 space-y-4">
            <div className="flex flex-col space-y-2 pb-4 border-b border-brand-text/5">
              <div 
                className="flex items-center justify-between text-sm uppercase tracking-widest font-bold text-brand-text dark:text-brand-text/90 py-4 touch-safe-hit"
                onClick={() => setActiveMenu(prev => prev === 'shop' ? 'none' : 'shop')}
              >
                <span>Shop Categories</span>
                <ChevronDown size={16} className={cn("transition-transform", activeMenu === 'shop' ? "rotate-180" : "")} />
              </div>
              
              {activeMenu === 'shop' && (
                <div className="pl-2 flex flex-col space-y-2 py-4 animate-in fade-in slide-in-from-top-1">
                  {NAVIGATION_DATA.map((cat) => (
                    <div key={cat.id} className="flex flex-col">
                      <Link 
                        href={cat.href}
                        className="flex items-center justify-between p-4 rounded-xl bg-brand-bg/50 dark:bg-brand-bg/80 border border-brand-text/5 dark:border-white/10 text-[11px] font-bold uppercase tracking-widest text-brand-text dark:text-brand-text/90 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {cat.name}
                        <ArrowRight size={14} className="text-brand-gold" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link href="/account?tab=wishlist" className="text-sm uppercase tracking-widest font-bold text-brand-text dark:text-brand-text/90 py-4 flex items-center justify-between" onClick={() => setIsOpen(false)}>
              <span>Wishlist</span>
              {isMounted && wishlistCount > 0 && <span className="bg-brand-gold text-white px-2 py-0.5 rounded-full text-[10px]">{wishlistCount}</span>}
            </Link>

            <Link href="/blog" className="text-sm uppercase tracking-widest font-bold text-brand-text dark:text-brand-text/90 py-4" onClick={() => setIsOpen(false)}>Blog</Link>
            <Link href="/franchise" className="text-sm uppercase tracking-widest font-bold text-brand-text dark:text-brand-text/90 py-4" onClick={() => setIsOpen(false)}>Franchise</Link>
            <Link href="/gift-cards" className="text-sm uppercase tracking-widest font-bold text-brand-text dark:text-brand-text/90 py-4" onClick={() => setIsOpen(false)}>Gift Cards</Link>
            
            <div className="pt-6 border-t border-brand-text/5 space-y-4">
               <button onClick={() => { setActiveMenu('search'); setIsOpen(false); }} className="w-full flex items-center justify-center space-x-3 p-5 rounded-2xl bg-brand-bg dark:bg-brand-bg/80 text-brand-text dark:text-brand-text/90 font-bold uppercase tracking-widest text-[11px] active:bg-brand-gold active:text-white transition-all">
                <Search size={18} /><span>Search</span>
              </button>
              <button onClick={() => { openAuthModal(); setIsOpen(false); }} className="w-full flex items-center justify-center space-x-3 p-5 rounded-2xl bg-brand-text dark:bg-brand-gold text-white font-bold uppercase tracking-widest text-[11px] active:bg-brand-gold transition-all">
                <User size={18} /><span>Login</span>
              </button>
              <button 
                onClick={() => { toggleTheme(); setIsOpen(false); }} 
                className="w-full flex items-center justify-center space-x-3 p-5 rounded-2xl bg-brand-bg dark:bg-brand-bg/80 text-brand-text dark:text-brand-text/90 font-bold uppercase tracking-widest text-[11px] active:bg-brand-gold active:text-white transition-all"
              >
                {theme === 'light' ? <><Moon size={18} /><span>Dark Mode</span></> : <><Sun size={18} /><span>Light Mode</span></>}
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
