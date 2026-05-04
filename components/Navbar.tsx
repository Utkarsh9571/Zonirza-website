'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, Diamond } from 'lucide-react';

import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Collections', href: '/category/all', hasDropdown: true },
    { name: 'Pages', href: '#', hasDropdown: true },
  ];

  return (
    <nav 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-700 px-6 md:px-16",
        isScrolled ? "py-4 bg-brand-bg/90 backdrop-blur-xl shadow-soft" : "py-10 bg-transparent"
      )}
    >
      <div className="max-w-[1440px] mx-auto flex justify-between items-center">
        {/* Logo - Diamond Style */}
        <Link href="/" className="flex items-center space-x-4 group">
          <div className="relative w-12 h-12 flex items-center justify-center">
             <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-full border border-white/30 rotate-45 group-hover:rotate-90 transition-transform duration-700"></div>
             <Diamond size={24} className="text-white relative z-10 drop-shadow-md" fill="currentColor" />
          </div>
          <span className="text-3xl font-serif font-bold tracking-tight text-white drop-shadow-lg">
            Zoniraz
          </span>
        </Link>

        {/* Unified Navbar Pill */}
        <div className={cn(
          "hidden md:flex items-center rounded-full pl-10 pr-2 py-2 transition-all duration-700",
          isScrolled 
            ? "bg-white shadow-premium border border-brand-text/5" 
            : "bg-white shadow-soft border border-white/20"
        )}>
          <div className="flex items-center space-x-10 mr-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={cn(
                  "text-[10px] uppercase tracking-[0.2em] font-bold transition-all hover:text-brand-gold",
                  "text-brand-text/60"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <Link 
            href="/contact"
            className="bg-brand-text text-white px-8 py-3 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-brand-gold transition-colors shadow-soft"
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className={cn(
            "md:hidden p-2 transition-colors",
            isScrolled ? "text-brand-text" : "text-white"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>


      {/* Mobile Menu */}
      <div 
        className={cn(
          "fixed inset-0 bg-brand-bg z-40 transition-all duration-700 md:hidden flex flex-col items-center justify-center space-y-10 px-6",
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        )}
      >
        <button className="absolute top-8 right-8 text-brand-text" onClick={() => setIsOpen(false)}>
          <X size={32} />
        </button>
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            href={link.href}
            onClick={() => setIsOpen(false)}
            className="text-4xl font-serif text-brand-text hover:text-brand-gold transition-colors"
          >
            {link.name}
          </Link>
        ))}
        <Link 
          href="/contact"
          onClick={() => setIsOpen(false)}
          className="bg-brand-text text-white px-12 py-5 rounded-full text-xs uppercase tracking-widest font-bold"
        >
          Contact Us
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
