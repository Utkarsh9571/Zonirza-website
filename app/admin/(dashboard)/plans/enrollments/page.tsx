'use client';

import React from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Loader2 } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AdminEnrollments() {
  const { data, error, isLoading } = useSWR('/api/admin/finance/enrollments', fetcher);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-brand-gold h-8 w-8" /></div>;
  }

  if (error || !data?.success) {
    return <div className="text-red-500">Failed to load enrollments.</div>;
  }

  const enrollments = data.data;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-serif text-brand-text dark:text-white">Enrollment Management</h1>
        <p className="text-brand-text/60 mt-1">View and manage all customer investment plans</p>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-xl border border-brand-text/10 shadow-sm overflow-hidden mt-8">
        <div className="p-6 border-b border-brand-text/10 bg-[#F9F9F9] dark:bg-[#222]">
          <h3 className="text-lg font-bold text-brand-text dark:text-white">All Enrollments</h3>
          <p className="text-sm text-brand-text/60 mt-1">A complete list of customers enrolled in Gold Mine or Gold Reserve plans.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#F9F9F9] dark:bg-[#222] text-brand-text/70 dark:text-white/70 font-bold border-b border-brand-text/10">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Plan Type</th>
                <th className="px-6 py-4">Installment</th>
                <th className="px-6 py-4">Progress</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-text/10">
              {enrollments.map((enrollment: any) => {
                const totalMonths = enrollment.pricingSnapshot?.durationMonths || 10;
                const paid = enrollment.installmentsPaid || 0;
                const progressPercent = Math.min((paid / totalMonths) * 100, 100);
                
                return (
                  <tr key={enrollment._id} className="hover:bg-brand-text/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-brand-text dark:text-white text-xs">
                      {enrollment._id.substring(0, 10)}...
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-brand-text dark:text-white">{enrollment.user?.name || 'Unknown'}</div>
                      <div className="text-xs text-brand-text/60">{enrollment.user?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                        enrollment.planType === 'gold_mine' 
                          ? 'border-brand-gold/20 bg-brand-gold/10 text-brand-gold' 
                          : 'border-blue-200 bg-blue-100 text-blue-700'
                      }`}>
                        {enrollment.planType === 'gold_mine' ? 'Gold Mine' : 'Gold Reserve'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold">₹{(enrollment.pricingSnapshot?.monthlyAmount || 0).toLocaleString()} / mo</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-brand-text dark:text-white">{paid}/{totalMonths}</span>
                        <div className="w-16 h-2 bg-brand-text/10 dark:bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${enrollment.planType === 'gold_mine' ? 'bg-brand-gold' : 'bg-blue-500'}`} 
                            style={{ width: `${progressPercent}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                        enrollment.status === 'active' ? 'border-green-200 bg-green-100 text-green-700' :
                        enrollment.status === 'suspended' ? 'border-red-200 bg-red-100 text-red-700' :
                        'border-gray-200 bg-gray-100 text-gray-700'
                      }`}>
                        {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/plans/enrollments/${enrollment._id}`} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                        View Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
              
              {enrollments.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-brand-text/50">No enrollments found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
