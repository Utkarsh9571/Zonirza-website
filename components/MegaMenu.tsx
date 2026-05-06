import React from 'react';
import Link from 'next/link';
import { Diamond, X } from 'lucide-react';

export type MegaMenuProps = {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose?: () => void;
};

const PlaceholderImage = ({ title }: { title: string }) => (
  <div className="group cursor-pointer mb-6">
    <h4 className="text-[11px] uppercase tracking-widest font-bold text-brand-text mb-3">{title}</h4>
    <div className="w-full aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:shadow-soft group-hover:scale-[1.02] border border-brand-text/5">
      <div className="flex flex-col items-center opacity-30">
        <Diamond size={24} className="mb-2" />
        <span className="text-xs font-bold tracking-widest uppercase font-serif">Zoniraz</span>
      </div>
    </div>
  </div>
);

const CategoryList = ({ title, links }: { title: string; links: { name: string; href: string }[] }) => (
  <div className="mb-8">
    <h4 className="text-[11px] uppercase tracking-widest font-bold text-brand-text mb-4 pb-2 border-b border-brand-text/5 inline-block">{title}</h4>
    <ul className="space-y-1">
      {links.map((link, idx) => (
        <li key={idx}>
          <Link href={link.href} className="text-sm text-brand-text/70 hover:text-brand-gold transition-colors block py-2 md:py-0.5">
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onMouseEnter, onMouseLeave, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="w-full bg-white rounded-[40px] border border-brand-text/5 z-50 animate-in slide-in-from-top-2 fade-in duration-200 overflow-hidden relative pointer-events-auto"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Close Button */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-6 p-2 rounded-full hover:bg-gray-100 text-brand-text/50 hover:text-brand-text transition-colors z-10"
        >
          <X size={20} />
        </button>
      )}

      {/* SECONDARY CATEGORY BAR */}
      <div className="border-b border-brand-text/5 bg-[#F9F7F3]">
        <div className="max-w-[1500px] mx-auto px-6 flex items-center justify-center space-x-12 h-14">
          {['Diamond', 'Solitaire', 'Gemstone', 'Plain Gold', 'Gift'].map((category) => (
            <div 
              key={category}
              className="h-full flex items-center cursor-pointer group px-2 border-b-2 border-transparent hover:border-brand-gold transition-colors"
            >
              <Link href={`/category/${category.toLowerCase()}`} className="text-[10px] uppercase tracking-[0.15em] font-bold text-brand-text/70 group-hover:text-brand-text transition-colors">
                {category}
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Column 1: Rings */}
          <div className="flex flex-col">
            <CategoryList 
              title="Ring" 
              links={[
                { name: 'Diamond', href: '/category/ring' },
                { name: 'Couple Bands', href: '/category/ring' },
                { name: 'Office Wear', href: '/category/ring' },
                { name: 'Cocktail', href: '/category/ring' },
                { name: 'For Men', href: '/category/ring' },
                { name: 'For Gift', href: '/category/ring' },
                { name: 'Love & Heart Ring', href: '/category/ring' },
                { name: 'Colour stone ring', href: '/category/ring' },
              ]} 
            />
          </div>

          {/* Column 2: Earrings */}
          <div className="flex flex-col">
            <CategoryList 
              title="Earrings" 
              links={[
                { name: 'Studs', href: '/category/earring' },
                { name: 'Drops', href: '/category/earring' },
                { name: 'Danglers', href: '/category/earring' },
                { name: 'For Kids', href: '/category/earring' },
                { name: 'Diamond', href: '/category/earring' },
                { name: 'For Gift', href: '/category/earring' },
                { name: 'Color Stone', href: '/category/earring' },
                { name: 'Cluster Studs', href: '/category/earring' },
                { name: 'Hoops Earrings', href: '/category/earring' },
              ]} 
            />
          </div>

          {/* Column 3: Pendants */}
          <div className="flex flex-col">
            <CategoryList 
              title="Pendant" 
              links={[
                { name: 'Zodiac', href: '/category/pendant' },
                { name: 'Love & Heart', href: '/category/pendant' },
                { name: 'Diamond', href: '/category/pendant' },
                { name: 'For Gift', href: '/category/pendant' },
                { name: 'Religious', href: '/category/pendant' },
                { name: 'Jersey Number', href: '/category/pendant' },
                { name: 'Initial', href: '/category/pendant' },
                { name: 'Colour stone Pendent', href: '/category/pendant' },
                { name: 'Color Stone', href: '/category/pendant' },
              ]} 
            />
          </div>

          {/* Column 4: Bracelet & Nose pin */}
          <div className="flex flex-col">
            <PlaceholderImage title="Bracelet" />
            <PlaceholderImage title="Nose pin" />
          </div>

          {/* Column 5: Chain, Mangalsutra, Necklace */}
          <div className="flex flex-col">
            <PlaceholderImage title="Chain" />
            <PlaceholderImage title="Mangalsutra" />
            <PlaceholderImage title="Necklace" />
          </div>

        </div>
      </div>
    </div>
  );
};
