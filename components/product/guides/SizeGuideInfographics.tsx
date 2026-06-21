'use client';

import React from 'react';

// Premium Gold Gradient Definition helper
const GoldGradientDef = () => (
  <defs>
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#BF953F" />
      <stop offset="25%" stopColor="#FCF6BA" />
      <stop offset="50%" stopColor="#B38728" />
      <stop offset="75%" stopColor="#FBF5B7" />
      <stop offset="100%" stopColor="#AA771C" />
    </linearGradient>
  </defs>
);

export function RingInfographic() {
  return (
    <svg viewBox="0 0 400 200" className="w-full h-auto bg-black/5 dark:bg-white/5 rounded-2xl p-4 border border-brand-gold/10">
      <GoldGradientDef />
      {/* Background aesthetic */}
      <rect width="100%" height="100%" fill="none" />
      {/* Circle representing the ring */}
      <circle cx="200" cy="90" r="45" fill="none" stroke="url(#goldGradient)" strokeWidth="3" />
      <circle cx="200" cy="90" r="41" fill="none" stroke="url(#goldGradient)" strokeWidth="1" strokeDasharray="4 2" />
      
      {/* Inner diameter line */}
      <line x1="155" y1="90" x2="245" y2="90" stroke="url(#goldGradient)" strokeWidth="1.5" />
      <path d="M 155 86 L 155 94 M 245 86 L 245 94" stroke="url(#goldGradient)" strokeWidth="1.5" />
      
      <text x="200" y="75" fill="#BF953F" fontSize="10" textAnchor="middle" letterSpacing="2" className="font-serif">INNER DIAMETER</text>
      <text x="200" y="105" fill="currentColor" fontSize="11" textAnchor="middle" fontWeight="bold">e.g. Size 12 = 1.72 cm</text>
      
      {/* Size guide description */}
      <text x="200" y="160" fill="currentColor" opacity="0.7" fontSize="10" textAnchor="middle">Measure inner diameter of your existing ring for exact size</text>
    </svg>
  );
}

export function ChainInfographic() {
  return (
    <svg viewBox="0 0 400 220" className="w-full h-auto bg-black/5 dark:bg-white/5 rounded-2xl p-4 border border-brand-gold/10">
      <GoldGradientDef />
      {/* Neck model silhouette */}
      <path d="M 120 220 Q 200 130 200 60 Q 200 30 180 30" fill="none" stroke="currentColor" opacity="0.1" strokeWidth="3" />
      <path d="M 280 220 Q 200 130 200 60 Q 200 30 220 30" fill="none" stroke="currentColor" opacity="0.1" strokeWidth="3" />
      
      {/* Chains representing lengths */}
      {/* 16" */}
      <path d="M 160 85 Q 200 115 240 85" fill="none" stroke="url(#goldGradient)" strokeWidth="1.5" />
      <text x="250" y="88" fill="#BF953F" fontSize="8" fontWeight="bold">16" (40cm)</text>

      {/* 18" */}
      <path d="M 150 95 Q 200 135 250 95" fill="none" stroke="url(#goldGradient)" strokeWidth="1.5" />
      <text x="260" y="98" fill="#BF953F" fontSize="8" fontWeight="bold">18" (45cm)</text>

      {/* 20" */}
      <path d="M 140 105 Q 200 155 260 105" fill="none" stroke="url(#goldGradient)" strokeWidth="2.5" />
      <text x="270" y="108" fill="#BF953F" fontSize="9" fontWeight="black">20" (50cm) - Default</text>

      {/* 22" */}
      <path d="M 130 115 Q 200 175 270 115" fill="none" stroke="url(#goldGradient)" strokeWidth="1.5" />
      <text x="282" y="118" fill="#BF953F" fontSize="8" fontWeight="bold">22" (55cm)</text>
      
      <text x="200" y="25" fill="#BF953F" fontSize="12" textAnchor="middle" letterSpacing="3" className="font-serif">CHAIN LENGTHS</text>
      <text x="200" y="200" fill="currentColor" opacity="0.7" fontSize="9" textAnchor="middle">Lengths represent necklace fall relative to collar bone</text>
    </svg>
  );
}

export function BraceletInfographic() {
  return (
    <svg viewBox="0 0 400 200" className="w-full h-auto bg-black/5 dark:bg-white/5 rounded-2xl p-4 border border-brand-gold/10">
      <GoldGradientDef />
      {/* Wrist line */}
      <rect x="150" y="60" width="100" height="80" rx="40" fill="none" stroke="currentColor" opacity="0.1" strokeWidth="8" />
      {/* Measuring Tape wrapping around */}
      <rect x="144" y="90" width="112" height="20" rx="10" fill="none" stroke="url(#goldGradient)" strokeWidth="2" strokeDasharray="6 3" />
      <text x="200" y="103" fill="#BF953F" fontSize="9" textAnchor="middle" fontWeight="bold">WRIST MEASUREMENT</text>
      
      {/* Sizing values table style */}
      <text x="70" y="170" fill="currentColor" fontSize="9" textAnchor="middle">Small (S): 6.5"</text>
      <text x="200" y="170" fill="currentColor" fontSize="10" textAnchor="middle" fontWeight="bold">Medium (M): 7.0"</text>
      <text x="330" y="170" fill="currentColor" fontSize="9" textAnchor="middle">Large (L): 7.5"</text>
      
      <text x="200" y="30" fill="#BF953F" fontSize="12" textAnchor="middle" letterSpacing="3" className="font-serif">BRACELET SIZING</text>
    </svg>
  );
}

export function BangleInfographic() {
  return (
    <svg viewBox="0 0 400 200" className="w-full h-auto bg-black/5 dark:bg-white/5 rounded-2xl p-4 border border-brand-gold/10">
      <GoldGradientDef />
      {/* Concentric bangles */}
      <circle cx="200" cy="95" r="38" fill="none" stroke="url(#goldGradient)" strokeWidth="1" opacity="0.6" />
      <circle cx="200" cy="95" r="42" fill="none" stroke="url(#goldGradient)" strokeWidth="3" />
      <circle cx="200" cy="95" r="46" fill="none" stroke="url(#goldGradient)" strokeWidth="1" opacity="0.6" />
      
      <text x="200" y="99" fill="currentColor" fontSize="10" textAnchor="middle" fontWeight="bold">Size 2.4 (5.7 cm)</text>
      
      <text x="70" y="170" fill="currentColor" fontSize="9" textAnchor="middle">2.2: 5.4cm</text>
      <text x="160" y="170" fill="currentColor" fontSize="9" textAnchor="middle">2.4: 5.7cm</text>
      <text x="240" y="170" fill="currentColor" fontSize="9" textAnchor="middle">2.6: 6.0cm</text>
      <text x="320" y="170" fill="currentColor" fontSize="9" textAnchor="middle">2.8: 6.4cm</text>
      
      <text x="200" y="30" fill="#BF953F" fontSize="12" textAnchor="middle" letterSpacing="3" className="font-serif">BANGLE SIZE (INNER DIAMETER)</text>
    </svg>
  );
}

export function GenderKidsInfographic({ type }: { type: 'men' | 'women' | 'kids' }) {
  const getGenderDetails = () => {
    switch (type) {
      case 'men':
        return {
          title: "MEN'S SIZE REFERENCE",
          desc: "Average Ring: 18-22 | Average Chain: 22\"-24\"",
          icon: "♂"
        };
      case 'kids':
        return {
          title: "KIDS' SIZE REFERENCE",
          desc: "Average Chain: 14\"-16\" | Adjustable Bangles Recommended",
          icon: "👶"
        };
      default:
        return {
          title: "WOMEN'S SIZE REFERENCE",
          desc: "Average Ring: 10-14 | Average Chain: 18\"-20\"",
          icon: "♀"
        };
    }
  };

  const details = getGenderDetails();

  return (
    <svg viewBox="0 0 400 130" className="w-full h-auto bg-black/5 dark:bg-white/5 rounded-2xl p-4 border border-brand-gold/10">
      <GoldGradientDef />
      <text x="200" y="35" fill="#BF953F" fontSize="13" textAnchor="middle" letterSpacing="3" className="font-serif">{details.title}</text>
      <text x="200" y="70" fill="currentColor" fontSize="24" textAnchor="middle">{details.icon}</text>
      <text x="200" y="105" fill="currentColor" opacity="0.8" fontSize="10" textAnchor="middle" fontWeight="bold">{details.desc}</text>
    </svg>
  );
}
