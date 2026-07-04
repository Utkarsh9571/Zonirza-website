'use client';

import React, { useEffect } from 'react';
import useSWR from 'swr';
import { Loader2, Download } from 'lucide-react';
import { Button } from '@/components/new-ui/Button';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function StatementReport() {
  const { data: walletData, isLoading } = useSWR('/api/digi-gold/wallet', fetcher);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-brand-gold h-12 w-12" />
      </div>
    );
  }

  if (!walletData?.success) {
    return <div className="p-10 text-center">Failed to load statement data.</div>;
  }

  const { wallet, transactions, valuation, liveRate } = walletData;

  return (
    <div className="bg-gray-100 min-h-screen py-10 font-sans print:bg-white print:py-0">
      
      {/* Controls - Hidden on print */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-end px-4 print:hidden">
        <Button onClick={handlePrint} className="flex items-center bg-brand-text text-white">
          <Download size={16} className="mr-2" /> Download / Print PDF
        </Button>
      </div>

      {/* A4 Document Format */}
      <div className="max-w-[210mm] mx-auto bg-white min-h-[297mm] p-12 md:p-16 shadow-lg print:shadow-none print:p-0">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-brand-gold pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-serif text-brand-text uppercase tracking-widest">Luxury Jewelry</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold mt-1">Digi Gold Wealth</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-brand-text mb-1">Portfolio Statement</h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* User & Portfolio Summary */}
        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <p className="text-[9px] uppercase tracking-widest font-bold text-gray-400 mb-1">Account Holder</p>
            <p className="font-bold text-brand-text text-lg">{wallet.userId?.name || 'Luxury Jewelry Member'}</p>
            <p className="text-xs text-gray-600">{wallet.userId?.email || ''}</p>
          </div>
          <div className="bg-brand-bg/30 p-6 rounded-lg border border-brand-gold/20">
            <p className="text-[9px] uppercase tracking-widest font-bold text-gray-400 mb-1">Total Valuation</p>
            <p className="text-3xl font-serif text-brand-gold">₹{valuation.currentValue.toLocaleString()}</p>
            <div className="mt-2 text-xs flex justify-between text-gray-600 font-medium">
              <span>Holdings: {wallet.totalGrams.toFixed(4)}g</span>
              <span>Rate: ₹{liveRate?.sellRate24K}/g</span>
            </div>
          </div>
        </div>

        {/* Investment Performance */}
        <div className="mb-12">
          <h3 className="text-xs uppercase tracking-widest font-bold text-gray-500 border-b border-gray-200 pb-2 mb-4">Investment Performance</h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400">Total Invested</p>
              <p className="text-lg font-bold text-brand-text mt-1">₹{valuation.totalInvested.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400">Unrealized Gain</p>
              <p className={`text-lg font-bold mt-1 ${valuation.unrealizedGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {valuation.unrealizedGainLoss >= 0 ? '+' : ''}₹{valuation.unrealizedGainLoss.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400">Growth</p>
              <p className={`text-lg font-bold mt-1 ${valuation.percentageGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {valuation.percentageGrowth >= 0 ? '+' : ''}{valuation.percentageGrowth.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <h3 className="text-xs uppercase tracking-widest font-bold text-gray-500 border-b border-gray-200 pb-2 mb-4">Transaction History</h3>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[9px] uppercase tracking-widest text-gray-400 border-b border-gray-100">
                <th className="py-3">Date</th>
                <th className="py-3">Type</th>
                <th className="py-3 text-right">Amount (₹)</th>
                <th className="py-3 text-right">Gold (g)</th>
                <th className="py-3 text-right">Exec. Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((tx: any) => (
                <tr key={tx._id}>
                  <td className="py-3 text-gray-600">{new Date(tx.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 font-bold uppercase text-[10px] tracking-widest text-brand-text">{tx.type}</td>
                  <td className="py-3 text-right font-medium">₹{tx.rupeeAmount.toLocaleString()}</td>
                  <td className="py-3 text-right text-brand-gold font-bold">
                    {tx.type === 'redeem' ? '-' : '+'}{tx.goldGrams.toFixed(4)}
                  </td>
                  <td className="py-3 text-right text-gray-500 text-xs">₹{tx.goldRateAtExecution.toLocaleString()}</td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400 text-xs uppercase tracking-widest">No transactions recorded</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-[9px] text-gray-400 uppercase tracking-widest leading-relaxed">
          <p>This is a computer generated statement and does not require a signature.</p>
          <p>Luxury Jewelers • www.example.com</p>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body { background-color: white; }
          @page { size: A4; margin: 15mm; }
        }
      `}</style>
    </div>
  );
}
