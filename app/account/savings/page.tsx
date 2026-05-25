'use client';

import React from 'react';
import { ShieldCheck, Calendar, Wallet, Download, Clock, Loader2, ArrowRight, Activity } from 'lucide-react';
import Link from 'next/link';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function CustomerSavingsDashboard() {
  const { data, error, isLoading } = useSWR('/api/finance/my-plans', fetcher);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="animate-spin text-brand-gold h-10 w-10" />
        <p className="text-brand-text/50 font-bold tracking-wider">LOADING YOUR VAULT...</p>
      </div>
    );
  }

  if (error || !data?.success) {
    return <div className="p-8 bg-red-100 text-red-700 rounded-xl">Failed to load investment portfolio. Please try again.</div>;
  }

  const plans = data.data || [];

  return (
    <div className="bg-brand-bg text-brand-text min-h-screen pt-32 pb-20 overflow-x-hidden transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-brand-text/10 dark:border-white/10 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-serif text-brand-text dark:text-white mb-2">My Investment Vault</h1>
          <p className="text-brand-text/60 dark:text-white/60">Manage your Gold Mine and Gold Reserve subscriptions</p>
        </div>
        <Link 
          href="/plans/gold-mine" 
          className="px-6 py-3 bg-brand-gold text-white text-sm font-bold tracking-wider rounded hover:bg-brand-gold/90 transition-colors flex items-center gap-2"
        >
          START NEW PLAN <ArrowRight size={16} />
        </Link>
      </div>

      {plans.length === 0 ? (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-brand-text/10 dark:border-white/10 p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-brand-text dark:text-white mb-4">Your Vault is Empty</h2>
          <p className="text-brand-text/60 dark:text-white/60 max-w-md mx-auto mb-8">
            Start protecting your wealth against inflation today. Enroll in our Gold Mine or Gold Reserve plans and watch your investment grow.
          </p>
          <Link 
            href="/plans/gold-mine" 
            className="inline-block px-8 py-3 bg-brand-text dark:bg-white text-white dark:text-brand-text font-bold tracking-wider rounded-md transition-colors"
          >
            EXPLORE PLANS
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {plans.map((plan: any) => {
            const totalMonths = plan.pricingSnapshot?.durationMonths || 10;
            const paid = plan.installmentsPaid || 0;
            const progressPercent = Math.min((paid / totalMonths) * 100, 100);
            const monthlyAmount = plan.pricingSnapshot?.monthlyAmount || 0;
            const maturityAmount = plan.pricingSnapshot?.maturityAmount || 0;
            const transactions = plan.transactions || [];
            
            // Calculate next payment date safely
            const nextDueDate = new Date(plan.nextPaymentDate);
            const isOverdue = nextDueDate < new Date() && plan.status === 'active';

            return (
              <div key={plan._id} className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-brand-text/10 dark:border-white/10 p-6 sm:p-8 shadow-sm relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

                <div className="relative">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                          plan.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          plan.status === 'suspended' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        }`}>
                          {plan.status}
                        </span>
                        <span className="text-xs text-brand-text/50 font-mono tracking-wider">ID: {plan._id.substring(0,8).toUpperCase()}</span>
                      </div>
                      <h2 className="text-2xl font-serif font-bold text-brand-text dark:text-brand-gold">
                        {plan.planType === 'gold_mine' ? 'Gold Mine (10+1)' : 'Gold Reserve'}
                      </h2>
                    </div>
                    {plan.status === 'active' && (
                      <div className="text-right p-3 bg-[#F9F9F9] dark:bg-[#222] rounded-lg border border-brand-text/5 dark:border-white/5">
                        <p className="text-xs text-brand-text/50 dark:text-white/50 mb-1 uppercase tracking-wider font-bold">Next Payment Due</p>
                        <p className={`font-bold flex items-center justify-end gap-2 ${isOverdue ? 'text-[#E55A44]' : 'text-brand-text dark:text-white'}`}>
                          <Calendar size={16} className={isOverdue ? "text-[#E55A44]" : "text-brand-gold"} /> 
                          {nextDueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {isOverdue && <span className="text-xs text-[#E55A44] ml-1">(Overdue)</span>}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-[#F9F9F9] dark:bg-[#222] p-6 rounded-xl border border-brand-text/5 dark:border-white/5">
                    <div>
                      <p className="text-xs text-brand-text/50 dark:text-white/50 mb-1">Monthly Installment</p>
                      <p className="font-bold text-lg text-brand-text dark:text-white">₹{monthlyAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-brand-text/50 dark:text-white/50 mb-1">Installments Paid</p>
                      <p className="font-bold text-lg text-brand-text dark:text-white">{paid} <span className="text-brand-text/30 text-sm">/ {totalMonths}</span></p>
                    </div>
                    <div>
                      <p className="text-xs text-brand-text/50 dark:text-white/50 mb-1">Total Paid</p>
                      <p className="font-bold text-lg text-brand-text dark:text-white">₹{(plan.totalAmountPaid || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-brand-text/50 dark:text-white/50 mb-1">Projected Maturity</p>
                      <p className="font-bold text-lg text-brand-gold">₹{maturityAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="font-bold text-brand-text dark:text-white">Progress to Maturity</span>
                      <span className="font-bold text-brand-gold">{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="w-full h-3 bg-brand-text/10 dark:bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${plan.planType === 'gold_mine' ? 'bg-brand-gold' : 'bg-blue-500'}`} 
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 border-t border-brand-text/5 dark:border-white/5 pt-6">
                    {plan.status === 'active' && paid < totalMonths && (
                      <button className="flex-1 py-4 bg-[#E55A44] hover:bg-[#D44A34] text-white font-bold tracking-wider rounded-md transition-colors flex items-center justify-center gap-2 shadow-md">
                        <Wallet size={18} /> PAY ₹{monthlyAmount.toLocaleString()} NOW
                      </button>
                    )}
                    <button className="flex-1 py-4 border border-brand-text/20 hover:border-brand-text text-brand-text dark:text-white dark:border-white/20 dark:hover:border-white font-bold tracking-wider rounded-md transition-colors flex items-center justify-center gap-2">
                      <Download size={18} /> DOWNLOAD STATEMENT
                    </button>
                  </div>

                  {/* Transaction History Sub-section */}
                  {transactions.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-brand-text/10 dark:border-white/10">
                      <h3 className="text-lg font-serif text-brand-text dark:text-white mb-6 flex items-center gap-2">
                        <Activity size={18} className="text-brand-gold" /> Payment History
                      </h3>
                      <div className="bg-[#F9F9F9] dark:bg-[#222] rounded-xl border border-brand-text/5 dark:border-white/5 overflow-hidden">
                        <table className="w-full text-sm text-left">
                          <thead className="text-brand-text/50 dark:text-white/50 uppercase text-xs font-bold border-b border-brand-text/5 dark:border-white/5">
                            <tr>
                              <th className="px-6 py-4">Date</th>
                              <th className="px-6 py-4">Installment</th>
                              <th className="px-6 py-4">Amount</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4 text-right">Receipt</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-brand-text/5 dark:divide-white/5 text-brand-text dark:text-white/90 bg-white dark:bg-[#1A1A1A]">
                            {transactions.map((tx: any) => (
                              <tr key={tx._id} className="hover:bg-[#F9F9F9] dark:hover:bg-[#222] transition-colors">
                                <td className="px-6 py-4">{new Date(tx.paidAt || tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                <td className="px-6 py-4 font-bold">{tx.installmentNumber}/{totalMonths}</td>
                                <td className="px-6 py-4 font-bold">₹{tx.amount.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                  <span className={`text-xs font-bold uppercase ${tx.status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-orange-500'}`}>
                                    {tx.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  {tx.status === 'success' && <button className="text-brand-gold hover:underline font-bold text-xs">PDF</button>}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}
