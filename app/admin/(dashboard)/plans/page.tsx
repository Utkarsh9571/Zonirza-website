'use client';

import React, { useState } from 'react';
import { Coins, Star, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AdminPlansDashboard() {
  const [stats, setStats] = useState({
    activeGoldMine: 124,
    activeGoldReserve: 89,
    totalCollected: 4500000,
    currentGoldRate: 6800
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-text dark:text-white">Investment Plans</h1>
          <p className="text-brand-text/60 mt-1">Manage Gold Mine and Gold Reserve ecosystems</p>
        </div>
        <div className="flex gap-4">
          <Link href="/admin/plans/settings" className="px-4 py-2 border border-brand-text/20 rounded-md hover:bg-black/5 transition-colors font-medium">
            Global Settings
          </Link>
          <Link href="/admin/plans/enrollments" className="px-4 py-2 bg-brand-gold text-white rounded-md hover:bg-brand-gold/90 transition-colors shadow-sm font-medium">
            View Enrollments
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#111] p-6 rounded-xl border border-brand-text/10 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-brand-text/70">Active Gold Mine</h3>
            <Star className="h-5 w-5 text-brand-gold" />
          </div>
          <div className="text-3xl font-bold text-brand-text dark:text-white mb-1">{stats.activeGoldMine}</div>
          <p className="text-xs text-brand-text/50">+12% from last month</p>
        </div>
        
        <div className="bg-white dark:bg-[#111] p-6 rounded-xl border border-brand-text/10 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-brand-text/70">Active Gold Reserve</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-brand-text dark:text-white mb-1">{stats.activeGoldReserve}</div>
          <p className="text-xs text-brand-text/50">+8% from last month</p>
        </div>

        <div className="bg-white dark:bg-[#111] p-6 rounded-xl border border-brand-text/10 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-brand-text/70">Total Collected</h3>
            <Coins className="h-5 w-5 text-brand-text/40" />
          </div>
          <div className="text-3xl font-bold text-brand-text dark:text-white mb-1">₹{(stats.totalCollected).toLocaleString()}</div>
          <p className="text-xs text-brand-text/50">Across all active plans</p>
        </div>

        <div className="bg-white dark:bg-[#111] p-6 rounded-xl border border-brand-text/10 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-brand-text/70">Current Gold Rate</h3>
            <Coins className="h-5 w-5 text-brand-gold" />
          </div>
          <div className="text-3xl font-bold text-brand-text dark:text-white mb-1">₹{stats.currentGoldRate}/g</div>
          <p className="text-xs text-brand-text/50">24KT - Last updated 2h ago</p>
        </div>
      </div>

      {/* Recent Enrollments Table Summary */}
      <div className="bg-white dark:bg-[#111] rounded-xl border border-brand-text/10 shadow-sm overflow-hidden mt-8">
        <div className="p-6 border-b border-brand-text/10">
          <h3 className="text-lg font-bold text-brand-text dark:text-white">Recent Enrollments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#F9F9F9] dark:bg-[#222] text-brand-text/70 dark:text-white/70 font-bold border-b border-brand-text/10">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Plan Type</th>
                <th className="px-6 py-4">Monthly Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-text/10">
              <tr className="hover:bg-brand-text/5 transition-colors">
                <td className="px-6 py-4 font-medium">Utkarsh Sharma</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full border border-brand-gold/20 px-2.5 py-0.5 text-xs font-bold bg-brand-gold/10 text-brand-gold">Gold Mine</span>
                </td>
                <td className="px-6 py-4 font-bold">₹2,000</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full border border-green-200 px-2.5 py-0.5 text-xs font-bold bg-green-100 text-green-700">Active</span>
                </td>
                <td className="px-6 py-4">Today</td>
              </tr>
              <tr className="hover:bg-brand-text/5 transition-colors">
                <td className="px-6 py-4 font-medium">Amit Kumar</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full border border-blue-200 px-2.5 py-0.5 text-xs font-bold bg-blue-100 text-blue-700">Gold Reserve</span>
                </td>
                <td className="px-6 py-4 font-bold">₹5,000</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full border border-green-200 px-2.5 py-0.5 text-xs font-bold bg-green-100 text-green-700">Active</span>
                </td>
                <td className="px-6 py-4">Yesterday</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
