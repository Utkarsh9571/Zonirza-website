'use client';

import React from 'react';
import { ShieldCheck, Calendar, Wallet, Download, Clock } from 'lucide-react';
import Link from 'next/link';

export default function CustomerSavingsDashboard() {
  return (
    <div className="space-y-8">
      <div className="border-b border-brand-text/10 dark:border-white/10 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-brand-text dark:text-white mb-2">My Investment Plans</h1>
          <p className="text-brand-text/60 dark:text-white/60">Manage your Gold Mine and Gold Reserve subscriptions</p>
        </div>
        <Link 
          href="/plans/gold-mine" 
          className="hidden sm:inline-block px-6 py-2 bg-brand-gold text-white text-sm font-bold tracking-wider rounded hover:bg-brand-gold/90 transition-colors"
        >
          START NEW PLAN
        </Link>
      </div>

      <div className="space-y-6">
        
        {/* Active Plan Card - Mocked Data */}
        <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-brand-text/10 dark:border-white/10 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
             <div>
               <div className="flex items-center gap-3 mb-1">
                 <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded-full uppercase tracking-wider">Active</span>
                 <span className="text-xs text-brand-text/50 font-mono">ID: ENR-ZON-9482</span>
               </div>
               <h2 className="text-2xl font-serif font-bold text-brand-text dark:text-brand-gold">Gold Mine (10+1)</h2>
             </div>
             <div className="text-right">
               <p className="text-sm text-brand-text/50 dark:text-white/50 mb-1">Next Payment Due</p>
               <p className="font-bold text-brand-text dark:text-white flex items-center justify-end gap-2"><Calendar size={16} className="text-[#E55A44]" /> 15th Aug 2026</p>
             </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 bg-[#F9F9F9] dark:bg-[#222] p-6 rounded-xl border border-brand-text/5 dark:border-white/5">
             <div>
               <p className="text-xs text-brand-text/50 dark:text-white/50 mb-1">Monthly Installment</p>
               <p className="font-bold text-lg text-brand-text dark:text-white">₹2,000</p>
             </div>
             <div>
               <p className="text-xs text-brand-text/50 dark:text-white/50 mb-1">Installments Paid</p>
               <p className="font-bold text-lg text-brand-text dark:text-white">5 <span className="text-brand-text/30 text-sm">/ 10</span></p>
             </div>
             <div>
               <p className="text-xs text-brand-text/50 dark:text-white/50 mb-1">Total Paid</p>
               <p className="font-bold text-lg text-brand-text dark:text-white">₹10,000</p>
             </div>
             <div>
               <p className="text-xs text-brand-text/50 dark:text-white/50 mb-1">Projected Maturity</p>
               <p className="font-bold text-lg text-brand-gold">₹22,000</p>
             </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="font-bold text-brand-text dark:text-white">Progress to Maturity</span>
              <span className="font-bold text-brand-gold">50%</span>
            </div>
            <div className="w-full h-3 bg-brand-text/10 dark:bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-brand-gold rounded-full" style={{ width: '50%' }}></div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 border-t border-brand-text/5 dark:border-white/5 pt-6">
            <button className="flex-1 py-3 bg-[#E55A44] hover:bg-[#D44A34] text-white font-bold tracking-wider rounded-md transition-colors flex items-center justify-center gap-2">
              <Wallet size={18} /> PAY ₹2,000 NOW
            </button>
            <button className="flex-1 py-3 border border-brand-text/20 hover:border-brand-text text-brand-text dark:text-white dark:border-white/20 dark:hover:border-white font-bold tracking-wider rounded-md transition-colors flex items-center justify-center gap-2">
              <Download size={18} /> DOWNLOAD STATEMENT
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <h3 className="text-xl font-serif text-brand-text dark:text-white mt-12 mb-6 flex items-center gap-2"><Clock size={20} className="text-brand-gold" /> Payment History</h3>
        
        <div className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-brand-text/10 dark:border-white/10 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#F9F9F9] dark:bg-[#222] text-brand-text/70 dark:text-white/70 uppercase text-xs font-bold border-b border-brand-text/5 dark:border-white/5">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Installment</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-text/5 dark:divide-white/5 text-brand-text dark:text-white/90">
              <tr className="hover:bg-brand-text/5 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">15th Jul 2026</td>
                <td className="px-6 py-4">5/10</td>
                <td className="px-6 py-4 font-bold">₹2,000</td>
                <td className="px-6 py-4"><span className="text-green-600 dark:text-green-400 font-bold text-xs uppercase">Success</span></td>
                <td className="px-6 py-4 text-right"><button className="text-blue-600 hover:underline text-xs">PDF</button></td>
              </tr>
              <tr className="hover:bg-brand-text/5 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">15th Jun 2026</td>
                <td className="px-6 py-4">4/10</td>
                <td className="px-6 py-4 font-bold">₹2,000</td>
                <td className="px-6 py-4"><span className="text-green-600 dark:text-green-400 font-bold text-xs uppercase">Success</span></td>
                <td className="px-6 py-4 text-right"><button className="text-blue-600 hover:underline text-xs">PDF</button></td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
