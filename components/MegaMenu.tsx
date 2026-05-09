'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ChevronRight, ArrowRight, Tag, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAVIGATION_DATA, TopCategory } from '@/constants/navigation';

export type MegaMenuProps = {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose?: () => void;
};

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onMouseEnter, onMouseLeave, onClose }) => {
  const [activeTabId, setActiveTabId] = useState<string>(NAVIGATION_DATA[0].id);
  const activeTab = NAVIGATION_DATA.find((tab) => tab.id === activeTabId) || NAVIGATION_DATA[0];
  const [activeFilter, setActiveFilter] = useState<string>(activeTab.filters[0]?.title || '');

  // Reset active tab and filter when menu closes or tab changes
  useEffect(() => {
    if (!isOpen) {
      setActiveTabId(NAVIGATION_DATA[0].id);
    }
  }, [isOpen]);

  useEffect(() => {
    if (activeTab.filters.length > 0) {
      setActiveFilter(activeTab.filters[0].title);
    }
  }, [activeTabId]);

  if (!isOpen) return null;

  return (
    <div 
      className="w-full bg-white rounded-[40px] border border-brand-text/5 shadow-premium z-50 animate-in slide-in-from-top-1 fade-in duration-300 overflow-hidden relative pointer-events-auto flex flex-col max-h-[90vh]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* 1. TOP MAIN CATEGORY NAVIGATION TABS */}
      <div className="border-b border-brand-text/5 px-8 flex justify-center">
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
          {NAVIGATION_DATA.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onMouseEnter={() => setActiveTabId(tab.id)}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTabId(tab.id);
                }}
                className={cn(
                  "px-5 py-6 relative transition-all duration-300 flex items-center space-x-2 group whitespace-nowrap touch-safe-hit",
                  activeTabId === tab.id ? "text-brand-text border-b-2 border-brand-text" : "text-brand-text/60 active:text-brand-text"
                )}
              >
                {Icon && <Icon size={16} strokeWidth={1.5} className="text-brand-text/40 group-hover:text-brand-text transition-colors" />}
                <span className="text-[11px] uppercase tracking-[0.1em] font-bold">
                  {tab.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden h-full">
        {/* 2. LEFT SIDEBAR FILTERS */}
        <aside className="w-60 border-r border-brand-text/5 p-6 overflow-y-auto no-scrollbar hidden md:block">
          <div className="space-y-1">
            {activeTab.filters.map((filterGroup, idx) => (
              <button
                key={idx}
                onMouseEnter={() => setActiveFilter(filterGroup.title)}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveFilter(filterGroup.title);
                }}
                className={cn(
                  "w-full text-left px-5 py-3 rounded-xl transition-all duration-300 relative touch-safe-hit",
                  activeFilter === filterGroup.title 
                    ? "bg-[#F9F3F1] text-brand-text font-bold" 
                    : "text-brand-text/60 active:bg-brand-bg/50"
                )}
              >
                {activeFilter === filterGroup.title && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#8B1D2F] rounded-r-full" />
                )}
                <span className="text-[12px] uppercase tracking-wider">{filterGroup.title}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* 3. MAIN CONTENT AREA */}
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 p-8 overflow-y-auto no-scrollbar flex flex-col">
            {/* Dynamic Content based on Active Filter */}
            {(() => {
              const isFirstFilter = activeTab.filters[0]?.title === activeFilter;
              const isVisualLabel = ['category', 'gifts for', 'all rivaah', 'exchange program'].includes(activeFilter.toLowerCase());
              
              if (isFirstFilter || isVisualLabel) {
                return (
                  <div className={cn(
                    "grid gap-y-8 gap-x-8 mb-10",
                    activeTab.subCategories.some(s => s.image) ? "grid-cols-4" : "grid-cols-3"
                  )}>
                    {activeTab.subCategories.map((sub, idx) => (
                      <Link 
                        key={idx} 
                        href={sub.href}
                        className={cn(
                          "group flex transition-all duration-300",
                          sub.image ? "flex-col space-y-3" : "items-center space-x-4"
                        )}
                        onClick={onClose}
                      >
                        {sub.image ? (
                          <>
                            <div className="aspect-square rounded-[20px] overflow-hidden border border-brand-text/5 shadow-soft bg-brand-bg relative">
                              <img 
                                src={sub.image} 
                                alt={sub.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
                            </div>
                            <span className="text-[12px] font-bold text-brand-text/80 group-hover:text-brand-text text-center uppercase tracking-wider">
                              {sub.name}
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 rounded-full bg-brand-bg flex items-center justify-center text-xl transition-transform duration-300 group-hover:scale-110 border border-brand-text/5">
                              {sub.thumbnail || '✨'}
                            </div>
                            <span className="text-[13px] font-medium text-brand-text/80 group-hover:text-brand-text transition-colors">
                              {sub.name}
                            </span>
                          </>
                        )}
                      </Link>
                    ))}
                  </div>
                );
              } else {
                return (
                  <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-10">
                    {activeTab.filters.find(f => f.title === activeFilter)?.options.map((option, idx) => (
                      <Link 
                        key={idx} 
                        href={option.href}
                        className="flex items-center space-x-4 group border-b border-brand-text/5 pb-4"
                        onClick={onClose}
                      >
                        <div className="w-8 h-8 rounded-full bg-brand-bg flex items-center justify-center text-sm transition-all duration-300 group-hover:bg-brand-gold group-hover:text-white">
                          <ArrowRight size={14} />
                        </div>
                        <span className="text-[14px] font-medium text-brand-text/70 group-hover:text-brand-gold transition-colors">
                          {option.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                );
              }
            })()}

            {/* Bottom View All Banner */}
            {activeTab.bottomBanner && (
              <div className="mt-auto pt-8 border-t border-brand-text/5">
                <div className="bg-[#FAF7F5] rounded-3xl p-6 flex items-center justify-between group overflow-hidden relative">
                  <div className="flex items-center space-x-6 relative z-10">
                    <div className="w-20 h-14 rounded-xl overflow-hidden shadow-soft">
                      <img src={activeTab.bottomBanner.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-brand-text mb-1">{activeTab.bottomBanner.title}</h4>
                      <p className="text-[11px] text-brand-text/50">{activeTab.bottomBanner.description}</p>
                    </div>
                  </div>
                  <Link 
                    href={activeTab.bottomBanner.href}
                    className="px-8 py-3 bg-[#8B1D2F] text-white text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-brand-text transition-colors relative z-10"
                    onClick={onClose}
                  >
                    View All
                  </Link>
                  {/* Decorative faint pattern */}
                  <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-brand-gold/5 to-transparent pointer-events-none" />
                </div>
              </div>
            )}
          </main>

          {/* 4. RIGHT SIDE PROMO BANNER */}
          <aside className="w-80 p-8 border-l border-brand-text/5 hidden xl:block">
            {activeTab.promotions.map((promo, idx) => (
              <div key={idx} className="flex flex-col h-full">
                <Link href={promo.href} className="group flex-1 flex flex-col" onClick={onClose}>
                  <div className="flex-1 rounded-[30px] overflow-hidden mb-6 relative">
                    <img 
                      src={promo.image} 
                      alt={promo.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-3">
                    <h5 className="text-xl font-serif font-bold text-brand-text leading-tight">
                      {promo.title}
                    </h5>
                    <div className="flex items-center text-brand-text/60 group-hover:text-brand-text transition-colors">
                      <span className="text-[11px] uppercase font-bold tracking-widest border-b border-brand-text/20 pb-1 mr-2">
                        {promo.description || 'Explore Now'}
                      </span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </div>
  );
};
