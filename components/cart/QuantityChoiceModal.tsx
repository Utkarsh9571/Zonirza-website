'use client';

import { X, Copy, Settings2 } from 'lucide-react';
import { Button } from '../new-ui/Button';

interface QuantityChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (choice: 'duplicate' | 'new') => void;
  itemName: string;
}

export function QuantityChoiceModal({ isOpen, onClose, onSelect, itemName }: QuantityChoiceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-300 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-brand-text/40 backdrop-blur-md animate-in fade-in duration-500" 
        onClick={onClose} 
      />
      <div className="relative w-full max-w-lg bg-white rounded-[45px] shadow-premium p-10 md:p-12 animate-in zoom-in slide-in-from-bottom-8 duration-700">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full bg-brand-bg text-brand-text/40 hover:text-brand-gold transition-all"
        >
          <X size={20} />
        </button>

        <div className="text-center space-y-8">
          <div className="space-y-3">
            <h3 className="text-2xl md:text-3xl font-serif text-brand-text">Customize Your Selection</h3>
            <p className="text-[10px] uppercase tracking-[0.2em] text-brand-text/40 font-bold leading-relaxed">
              How would you like to add another <span className="text-brand-text">“{itemName}”</span> to your selection?
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 pt-4">
            <button
              onClick={() => onSelect('duplicate')}
              className="group flex items-center p-6 rounded-3xl border border-brand-text/5 bg-brand-bg hover:border-brand-gold hover:bg-white transition-all duration-500 text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-brand-gold group-hover:text-white flex items-center justify-center text-brand-text/40 transition-colors shrink-0">
                <Copy size={20} />
              </div>
              <div className="ml-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-brand-text">Copy Configuration</p>
                <p className="text-[9px] text-brand-text/40 uppercase tracking-widest mt-1">Use same size and metal choices</p>
              </div>
            </button>

            <button
              onClick={() => onSelect('new')}
              className="group flex items-center p-6 rounded-3xl border border-brand-text/5 bg-brand-bg hover:border-brand-gold hover:bg-white transition-all duration-500 text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-brand-gold group-hover:text-white flex items-center justify-center text-brand-text/40 transition-colors shrink-0">
                <Settings2 size={20} />
              </div>
              <div className="ml-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-brand-text">Customize Separately</p>
                <p className="text-[9px] text-brand-text/40 uppercase tracking-widest mt-1">Select new size or customizations</p>
              </div>
            </button>
          </div>

          <p className="text-[9px] text-brand-text/30 font-medium italic">
            Each luxury masterpiece is crafted with individual attention.
          </p>
        </div>
      </div>
    </div>
  );
}
