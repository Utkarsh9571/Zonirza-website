'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Diamond, ShieldCheck, Ruler } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  RingInfographic, 
  ChainInfographic, 
  BraceletInfographic, 
  BangleInfographic,
  GenderKidsInfographic
} from './SizeGuideInfographics';

// 1. Gold Purity Educational Map
const PURITY_INFO = [
  { purity: '22K', goldPct: '91.6%', durability: 'Soft, delicate', suit: 'Best for traditional plain gold jewelry. NOT recommended for secure diamond settings.', tip: 'Traditional Heirloom Gold' },
  { purity: '18K', goldPct: '75.0%', durability: 'Moderate, secure', suit: 'Best balance of color, value, and strength. Highly recommended for premium diamond jewelry.', tip: 'The Standard for Fine Diamonds' },
  { purity: '14K', goldPct: '58.5%', durability: 'High durability', suit: 'Excellent resistance to scratches. Great for daily wear diamond and gemstone jewelry.', tip: 'Ideal for Active Lifestyles' },
  { purity: '9K', goldPct: '37.5%', durability: 'Maximum hardness', suit: 'Highly durable budget option. Lighter gold color, perfect for daily casual fashion wear.', tip: 'Affordable Fashion Choice' },
];

// 2. Diamond Quality Educational Map
const DIAMOND_INFO = [
  { grade: 'EF-VVS', color: 'Colorless (E-F)', clarity: 'Very Very Slightly Included (VVS1-VVS2)', appearance: 'Completely clean to the naked eye. Flawless fire & brilliance.', positioning: 'Elite collectors grade', recommended: 'Buyers looking for maximum sparkle & luxury purity' },
  { grade: 'GH-VS', color: 'Near Colorless (G-H)', clarity: 'Very Slightly Included (VS1-VS2)', appearance: 'Eye-clean under all lighting conditions. Outstanding value.', positioning: 'Premium market standard', recommended: 'Smart luxury buyers seeking top visual quality' },
  { grade: 'GHI-VS', color: 'Near Colorless (G-I)', clarity: 'Very Slightly Included (VS1-VS2)', appearance: 'Great balance of color and clarity. Subtle color only visible to experts.', positioning: 'Modern luxury standard', recommended: 'Everyday fine jewelry collectors' },
  { grade: 'FG-SI', color: 'Colorless to Near (F-G)', clarity: 'Slightly Included (SI1-SI2)', appearance: 'Superb brightness. Inclusions only visible under 10x magnification.', positioning: 'Popular commercial grade', recommended: 'Budget-conscious diamond fashion collectors' },
  { grade: 'IJ-SI', color: 'Warm White (I-J)', clarity: 'Slightly Included (SI1-SI2)', appearance: 'Warm white hue. Excellent budget-friendly sparkle.', positioning: 'Accessibly priced entry-level', recommended: 'Gifting and entry-level luxury collectors' },
];

// 3. Stone Sizing & Characteristic Map
const STONE_CHARACTERS: Record<string, { character: string, color: string, durability: string, use: string }> = {
  'ruby': { character: 'King of precious stones, symbol of love and vitality.', color: 'Deep pigeon-blood red.', durability: '9.0 Mohs (Excellent hardness)', use: 'Fine statement rings and bridal necklaces.' },
  'emerald': { character: 'Stone of wisdom, hope, and lush renewal.', color: 'Vibrant moss green to bluish-green.', durability: '7.5 - 8.0 Mohs (Requires care)', use: 'Luxury cocktail rings and pendants.' },
  'sapphire': { character: 'Symbolizes nobility, truth, and celestial purity.', color: 'Royal velvety blue.', durability: '9.0 Mohs (Excellent hardness)', use: 'Royal engagement rings and daily wear jewelry.' },
  'topaz': { character: 'Stone of good fortune and creative energy.', color: 'Vibrant Swiss blue, imperial golden, or clear.', durability: '8.0 Mohs (Good durability)', use: 'Fashion necklaces and studs.' },
  'opal': { character: 'Famous for its magical play-of-color flashes.', color: 'Milky white or black with rainbow flashes.', durability: '5.5 - 6.5 Mohs (Fragile, avoid impact)', use: 'Delicate fashion jewelry.' },
  'amethyst': { character: 'Symbolizes peace, sobriety, and spiritual strength.', color: 'Deep royal purple.', durability: '7.0 Mohs (Moderate durability)', use: 'Fashion statement rings and casual pendants.' },
  'moissanite': { character: 'Space-born diamond alternative with double refractive fire.', color: 'Colorless to near-colorless.', durability: '9.25 Mohs (Extremely hard & scratchproof)', use: 'Engagement bands and high-fire studs.' },
  'cz': { character: 'Flawless diamond simulant with premium sparkle.', color: 'Perfect colorless.', durability: '8.5 Mohs (Very durable)', use: 'Daily wear travel jewelry.' },
  'zirconia': { character: 'Flawless diamond simulant with premium sparkle.', color: 'Perfect colorless.', durability: '8.5 Mohs (Very durable)', use: 'Daily wear travel jewelry.' },
};

interface ProductKnowledgeGuideProps {
  product: {
    category: string;
    jewelryType: 'diamond' | 'stone' | 'gold';
    stoneType?: string;
    tags?: string[];
  };
}

export function ProductKnowledgeGuide({ product }: ProductKnowledgeGuideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'purity' | 'diamond' | 'stone' | 'size'>('purity');

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsOpen(true);
      if (customEvent.detail?.tab) {
        setActiveTab(customEvent.detail.tab);
      }
    };
    window.addEventListener('open-product-knowledge-guide', handleOpen);
    return () => window.removeEventListener('open-product-knowledge-guide', handleOpen);
  }, []);

  const category = (product.category || '').toLowerCase();
  const jType = (product.jewelryType || '').toLowerCase();
  
  // Decide which guides are relevant
  const showPurity = true; // Always relevant
  const showDiamond = jType === 'diamond';
  const showStone = jType === 'stone';
  const showSize = ['rings', 'bangles', 'chains', 'bracelets', 'necklaces', 'mangalsutras', 'anklets'].includes(category);

  // Get matching gemstone info if stone
  const stoneName = (product.stoneType || '').toLowerCase();
  const stoneDetail = STONE_CHARACTERS[stoneName] || STONE_CHARACTERS['default'];

  // Default active tab selection based on relevance
  const defaultTab = () => {
    if (showPurity) return 'purity';
    if (showDiamond) return 'diamond';
    if (showStone) return 'stone';
    return 'size';
  };

  return (
    <div className="border border-brand-gold/15 dark:border-white/10 rounded-[32px] overflow-hidden bg-white/40 dark:bg-white/5 backdrop-blur-md shadow-premium transition-all duration-500">
      {/* Dropdown Header Trigger */}
      <button 
        onClick={() => {
          setIsOpen(!isOpen);
          // Set sensible tab on open
          if (!isOpen) {
            setActiveTab(defaultTab());
          }
        }}
        className="w-full p-6 flex items-center justify-between text-[11px] uppercase tracking-[0.25em] font-black text-brand-text dark:text-white hover:bg-brand-gold/5 active:bg-brand-gold/10 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <BookOpen size={16} className="text-brand-gold" />
          <span>Product Knowledge Guide</span>
        </div>
        {isOpen ? <ChevronUp size={16} className="text-brand-gold" /> : <ChevronDown size={16} className="text-brand-gold" />}
      </button>

      {isOpen && (
        <div className="p-8 pt-0 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
          
          {/* Tab Bar Selection */}
          <div className="flex flex-wrap gap-2 border-b border-brand-text/5 dark:border-white/10 pb-4">
            {showPurity && (
              <button 
                onClick={() => setActiveTab('purity')}
                className={cn(
                  "px-4 py-2 rounded-xl text-[9px] uppercase tracking-widest font-black transition-all",
                  activeTab === 'purity' ? "bg-brand-gold text-[#12100e] shadow-soft" : "text-brand-text/60 dark:text-white/60 hover:text-brand-gold"
                )}
              >
                Purity
              </button>
            )}
            {showDiamond && (
              <button 
                onClick={() => setActiveTab('diamond')}
                className={cn(
                  "px-4 py-2 rounded-xl text-[9px] uppercase tracking-widest font-black transition-all",
                  activeTab === 'diamond' ? "bg-brand-gold text-[#12100e] shadow-soft" : "text-brand-text/60 dark:text-white/60 hover:text-brand-gold"
                )}
              >
                Diamond Grades
              </button>
            )}
            {showStone && (
              <button 
                onClick={() => setActiveTab('stone')}
                className={cn(
                  "px-4 py-2 rounded-xl text-[9px] uppercase tracking-widest font-black transition-all",
                  activeTab === 'stone' ? "bg-brand-gold text-[#12100e] shadow-soft" : "text-brand-text/60 dark:text-white/60 hover:text-brand-gold"
                )}
              >
                Gemstone
              </button>
            )}
            {showSize && (
              <button 
                onClick={() => setActiveTab('size')}
                className={cn(
                  "px-4 py-2 rounded-xl text-[9px] uppercase tracking-widest font-black transition-all",
                  activeTab === 'size' ? "bg-brand-gold text-[#12100e] shadow-soft" : "text-brand-text/60 dark:text-white/60 hover:text-brand-gold"
                )}
              >
                Sizing Guide
              </button>
            )}
          </div>

          {/* TAB CONTENTS */}

          {/* 1. Gold Purity Tab */}
          {activeTab === 'purity' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center space-x-2 text-[10px] uppercase tracking-wider text-brand-gold font-bold"><ShieldCheck size={14}/> Gold Purity & Suitability</div>
              <div className="grid grid-cols-1 gap-4">
                {PURITY_INFO.map((item) => (
                  <div key={item.purity} className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-brand-text/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-black text-brand-text dark:text-white">{item.purity}</span>
                        <span className="text-[10px] text-brand-gold font-bold">({item.goldPct} Pure Gold)</span>
                      </div>
                      <p className="text-[11px] text-brand-text/70 dark:text-brand-text/80 leading-relaxed">{item.suit}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] uppercase tracking-widest px-2.5 py-1 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-full font-black">{item.tip}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Diamond Quality Tab */}
          {activeTab === 'diamond' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center space-x-2 text-[10px] uppercase tracking-wider text-brand-gold font-bold"><Diamond size={14}/> 4Cs & Diamond Clarity Reference</div>
              <div className="grid grid-cols-1 gap-4">
                {DIAMOND_INFO.map((item) => (
                  <div key={item.grade} className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-brand-text/5 space-y-2">
                    <div className="flex items-center justify-between border-b border-brand-text/5 dark:border-white/5 pb-2">
                      <span className="text-xs font-black text-brand-gold">{item.grade}</span>
                      <span className="text-[9px] uppercase tracking-widest text-brand-text/40">{item.positioning}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-[10px]">
                      <div>
                        <span className="block text-brand-text/50 uppercase">Color Grade</span>
                        <span className="font-bold text-brand-text dark:text-white">{item.color}</span>
                      </div>
                      <div>
                        <span className="block text-brand-text/50 uppercase">Clarity Grade</span>
                        <span className="font-bold text-brand-text dark:text-white">{item.clarity}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-brand-text/70 dark:text-brand-text/80 pt-1 leading-relaxed"><span className="font-bold text-brand-text">Visual:</span> {item.appearance}</p>
                    <p className="text-[9px] bg-brand-gold/5 text-brand-gold px-2.5 py-1 rounded-lg"><span className="font-bold">Best For:</span> {item.recommended}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Gemstone Tab */}
          {activeTab === 'stone' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center space-x-2 text-[10px] uppercase tracking-wider text-brand-gold font-bold"><Diamond size={14}/> Gemstone Reference: {product.stoneType || 'Gemstone'}</div>
              {stoneDetail ? (
                <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-brand-text/5 space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-brand-text/40">Characteristics</p>
                    <p className="text-xs text-brand-text dark:text-white font-medium">{stoneDetail.character}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6 text-[10px] pt-2 border-t border-brand-text/5">
                    <div>
                      <span className="block text-brand-text/50 uppercase">Natural Color</span>
                      <span className="font-bold text-brand-text dark:text-white">{stoneDetail.color}</span>
                    </div>
                    <div>
                      <span className="block text-brand-text/50 uppercase">Durability rating</span>
                      <span className="font-bold text-brand-text dark:text-white">{stoneDetail.durability}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-brand-text/5 text-[10px]">
                    <span className="block text-brand-text/50 uppercase">Ideal Use</span>
                    <span className="font-bold text-brand-text dark:text-white">{stoneDetail.use}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-brand-text/60 italic">No gemstone details available for this stone type.</p>
              )}
            </div>
          )}

          {/* 4. Sizing Guides Tab */}
          {activeTab === 'size' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center space-x-2 text-[10px] uppercase tracking-wider text-brand-gold font-bold"><Ruler size={14}/> Interactive Sizing Chart</div>
              
              {/* Infographics depending on category */}
              {category.includes('ring') && <RingInfographic />}
              {(category.includes('chain') || category.includes('necklace') || category.includes('mangalsutra')) && <ChainInfographic />}
              {(category.includes('bracelet') || category.includes('anklet')) && <BraceletInfographic />}
              {category.includes('bangle') && <BangleInfographic />}
              
              {/* Gender specifications based on tags */}
              {product.tags?.includes('men') && <GenderKidsInfographic type="men" />}
              {product.tags?.includes('kids') && <GenderKidsInfographic type="kids" />}
              {!product.tags?.includes('men') && !product.tags?.includes('kids') && <GenderKidsInfographic type="women" />}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
