'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, User, FileText, CreditCard, Clock, Activity, Download } from 'lucide-react';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AdminEnrollmentDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const { data, error, isLoading, mutate } = useSWR(`/api/admin/finance/enrollments/${unwrappedParams.id}`, fetcher);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-brand-gold h-8 w-8" /></div>;
  }

  if (error || !data?.success) {
    return <div className="text-red-500">Failed to load enrollment details.</div>;
  }

  const enrollment = data.data;
  const user = enrollment.user;
  const nominee = enrollment.nominee;
  const transactions = enrollment.transactions || [];
  
  const handleStatusChange = async (newStatus: string) => {
    if (!confirm(`Are you sure you want to change the status to ${newStatus}?`)) return;
    
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/finance/enrollments/${unwrappedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        mutate(); // Revalidate SWR data
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      alert('An error occurred');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const totalMonths = enrollment.pricingSnapshot?.durationMonths || 10;
  const paid = enrollment.installmentsPaid || 0;
  const progressPercent = Math.min((paid / totalMonths) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 border-b border-brand-text/10 pb-6">
        <button onClick={() => router.back()} className="p-2 hover:bg-black/5 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-brand-text dark:text-white">Enrollment Details</h1>
          <p className="text-brand-text/60 font-mono text-sm mt-1">ID: {enrollment._id}</p>
        </div>
        <div className="ml-auto">
          <select 
            disabled={updatingStatus}
            value={enrollment.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`px-4 py-2 rounded-md font-bold text-sm border focus:outline-none focus:ring-2 focus:ring-brand-gold ${
              enrollment.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
              enrollment.status === 'suspended' ? 'bg-red-100 text-red-800 border-red-200' :
              'bg-gray-100 text-gray-800 border-gray-200'
            }`}
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="matured">Matured</option>
            <option value="redeemed">Redeemed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User & Plan Info */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white dark:bg-[#111] p-6 rounded-xl border border-brand-text/10 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><User size={18} className="text-brand-gold"/> Customer Info</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-brand-text/50 text-xs">Name</p>
                <p className="font-bold">{user?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-brand-text/50 text-xs">Email</p>
                <p className="font-bold">{user?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-brand-text/50 text-xs">Phone</p>
                <p className="font-bold">{user?.phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111] p-6 rounded-xl border border-brand-text/10 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><FileText size={18} className="text-brand-gold"/> Plan Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-brand-text/50 text-xs">Plan Type</p>
                <p className="font-bold">{enrollment.planType === 'gold_mine' ? 'Gold Mine (10+1)' : 'Gold Reserve'}</p>
              </div>
              <div>
                <p className="text-brand-text/50 text-xs">Monthly Installment</p>
                <p className="font-bold text-lg text-brand-gold">₹{(enrollment.pricingSnapshot?.monthlyAmount || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-brand-text/50 text-xs">Enrollment Date</p>
                <p className="font-bold">{new Date(enrollment.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-brand-text/50 text-xs">Maturity Date</p>
                <p className="font-bold text-[#E55A44]">{new Date(enrollment.maturityDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111] p-6 rounded-xl border border-brand-text/10 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Activity size={18} className="text-brand-gold"/> Nominee</h3>
            {nominee ? (
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-brand-text/50 text-xs">Full Name</p>
                  <p className="font-bold">{nominee.fullName}</p>
                </div>
                <div>
                  <p className="text-brand-text/50 text-xs">Relationship</p>
                  <p className="font-bold capitalize">{nominee.relationship}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-brand-text/50">No nominee recorded.</p>
            )}
          </div>
        </div>

        {/* Right Column - Ledger & Progress */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Progress Card */}
          <div className="bg-white dark:bg-[#111] p-6 rounded-xl border border-brand-text/10 shadow-sm">
            <h3 className="font-bold text-lg mb-6">Maturity Progress</h3>
            
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-sm font-bold text-brand-text">Installments Paid</p>
                <p className="text-2xl font-bold">{paid} <span className="text-sm text-brand-text/50">/ {totalMonths}</span></p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-brand-text">Total Accumulated</p>
                <p className="text-2xl font-bold text-brand-gold">₹{(enrollment.totalAmountPaid || 0).toLocaleString()}</p>
              </div>
            </div>
            
            <div className="w-full h-3 bg-brand-text/10 rounded-full overflow-hidden mb-6">
              <div 
                className={`h-full ${enrollment.planType === 'gold_mine' ? 'bg-brand-gold' : 'bg-blue-500'}`} 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-brand-text/10">
              <div>
                <p className="text-xs text-brand-text/50">Projected Bonus</p>
                <p className="font-bold">₹{(enrollment.pricingSnapshot?.bonusAmount || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-brand-text/50">Total Value</p>
                <p className="font-bold">₹{(enrollment.pricingSnapshot?.maturityAmount || 0).toLocaleString()}</p>
              </div>
              {enrollment.planType === 'gold_reserve' && (
                <div>
                  <p className="text-xs text-brand-text/50">Gold Accumulated</p>
                  <p className="font-bold">{(enrollment.accumulatedGoldGrams || 0).toFixed(4)}g</p>
                </div>
              )}
            </div>
          </div>

          {/* Ledger Table */}
          <div className="bg-white dark:bg-[#111] rounded-xl border border-brand-text/10 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-brand-text/10 flex justify-between items-center bg-[#F9F9F9] dark:bg-[#222]">
              <h3 className="font-bold text-lg flex items-center gap-2"><Clock size={18} className="text-brand-gold" /> Transaction Ledger</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#F9F9F9] dark:bg-[#222] text-brand-text/70 font-bold border-b border-brand-text/10">
                  <tr>
                    <th className="px-6 py-4">#</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Gateway Ref</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-text/10">
                  {transactions.map((tx: any) => (
                    <tr key={tx._id} className="hover:bg-brand-text/5 transition-colors">
                      <td className="px-6 py-4 font-bold">{tx.installmentNumber}</td>
                      <td className="px-6 py-4">{new Date(tx.paidAt || tx.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-bold">₹{(tx.amount || 0).toLocaleString()}</td>
                      <td className="px-6 py-4 font-mono text-xs">{tx.gatewayReference || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full border border-green-200 px-2.5 py-0.5 text-xs font-bold bg-green-100 text-green-700">
                          {tx.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-brand-text/50">No transactions recorded yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
