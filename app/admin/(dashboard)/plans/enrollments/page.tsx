'use client';

import React from 'react';

export default function AdminEnrollments() {
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
              <tr className="hover:bg-brand-text/5 transition-colors">
                <td className="px-6 py-4 font-bold text-brand-text dark:text-white">ENR-1001</td>
                <td className="px-6 py-4">
                  <div className="font-bold text-brand-text dark:text-white">Utkarsh Sharma</div>
                  <div className="text-xs text-brand-text/60">utkarsh@example.com</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full border border-brand-gold/20 px-2.5 py-0.5 text-xs font-bold bg-brand-gold/10 text-brand-gold">Gold Mine</span>
                </td>
                <td className="px-6 py-4 font-bold">₹2,000 / mo</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                     <span className="text-xs font-bold text-brand-text dark:text-white">1/10</span>
                     <div className="w-16 h-2 bg-brand-text/10 dark:bg-white/10 rounded-full overflow-hidden">
                       <div className="w-[10%] h-full bg-brand-gold"></div>
                     </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full border border-green-200 px-2.5 py-0.5 text-xs font-bold bg-green-100 text-green-700">Active</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">View Details</button>
                </td>
              </tr>
              <tr className="hover:bg-brand-text/5 transition-colors">
                <td className="px-6 py-4 font-bold text-brand-text dark:text-white">ENR-1002</td>
                <td className="px-6 py-4">
                  <div className="font-bold text-brand-text dark:text-white">Amit Kumar</div>
                  <div className="text-xs text-brand-text/60">amit@example.com</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full border border-blue-200 px-2.5 py-0.5 text-xs font-bold bg-blue-100 text-blue-700">Gold Reserve</span>
                </td>
                <td className="px-6 py-4 font-bold">₹5,000 / mo</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                     <span className="text-xs font-bold text-brand-text dark:text-white">5/10</span>
                     <div className="w-16 h-2 bg-brand-text/10 dark:bg-white/10 rounded-full overflow-hidden">
                       <div className="w-[50%] h-full bg-blue-500"></div>
                     </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full border border-green-200 px-2.5 py-0.5 text-xs font-bold bg-green-100 text-green-700">Active</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">View Details</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
