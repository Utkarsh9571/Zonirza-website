'use client';

import React, { useState } from 'react';
import { Save } from 'lucide-react';

export default function AdminPlansSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [goldRate, setGoldRate] = useState(6800);
  const [goldMineActive, setGoldMineActive] = useState(true);
  const [goldReserveActive, setGoldReserveActive] = useState(true);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-serif text-brand-text dark:text-white">Global Plan Settings</h1>
        <p className="text-brand-text/60 mt-1">Configure parameters for all financial plans</p>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-xl border border-brand-text/10 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-brand-text/10 bg-[#F9F9F9] dark:bg-[#222]">
          <h3 className="text-lg font-bold text-brand-text dark:text-white">Gold Rate Configuration</h3>
          <p className="text-sm text-brand-text/60 mt-1">
            This rate will be used to calculate Gold Reserve unit accumulations.
            In the future, this can be synced automatically via an external API.
          </p>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-text dark:text-white block">Manual Gold Rate (₹ / Gram - 24KT)</label>
            <input 
              type="number" 
              value={goldRate}
              onChange={(e) => setGoldRate(Number(e.target.value))}
              className="flex h-10 w-full max-w-sm rounded-md border border-brand-text/20 bg-transparent px-3 py-2 text-sm text-brand-text dark:text-white focus:outline-none focus:border-brand-gold transition-colors"
            />
          </div>
        </div>
        <div className="p-6 border-t border-brand-text/10 bg-[#F9F9F9] dark:bg-[#222]">
          <button 
            onClick={handleSave} 
            disabled={isSaving} 
            className="flex items-center gap-2 px-6 py-2 bg-brand-gold text-white font-bold rounded-md hover:bg-brand-gold/90 transition-colors disabled:opacity-70"
          >
            <Save size={16} /> {isSaving ? 'Saving...' : 'Update Gold Rate'}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-xl border border-brand-text/10 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-brand-text/10 bg-[#F9F9F9] dark:bg-[#222]">
          <h3 className="text-lg font-bold text-brand-text dark:text-white">Plan Availability</h3>
          <p className="text-sm text-brand-text/60 mt-1">Enable or disable entire plan ecosystems globally.</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-base font-bold text-brand-text dark:text-white">Gold Mine (10+1)</label>
              <p className="text-sm text-brand-text/60">Allows users to subscribe to 10+1 monthly plans.</p>
            </div>
            <div 
              className={`w-12 h-6 rounded-full cursor-pointer relative transition-colors ${goldMineActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}
              onClick={() => setGoldMineActive(!goldMineActive)}
            >
              <div className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${goldMineActive ? 'left-[26px]' : 'left-[2px]'}`}></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-base font-bold text-brand-text dark:text-white">Gold Reserve</label>
              <p className="text-sm text-brand-text/60">Allows users to accumulate gold units monthly.</p>
            </div>
            <div 
              className={`w-12 h-6 rounded-full cursor-pointer relative transition-colors ${goldReserveActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}
              onClick={() => setGoldReserveActive(!goldReserveActive)}
            >
              <div className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${goldReserveActive ? 'left-[26px]' : 'left-[2px]'}`}></div>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-brand-text/10 bg-[#F9F9F9] dark:bg-[#222]">
          <button 
            onClick={handleSave} 
            disabled={isSaving} 
            className="flex items-center gap-2 px-6 py-2 border border-brand-text/20 text-brand-text dark:text-white font-bold rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-70"
          >
            <Save size={16} /> {isSaving ? 'Saving...' : 'Save Availability'}
          </button>
        </div>
      </div>
    </div>
  );
}
