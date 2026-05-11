'use client';

import { Check, Clock, Package, Truck, ShieldCheck, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type OrderStatus = 'placed' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface TimelineStep {
  id: OrderStatus;
  label: string;
  icon: any;
  description: string;
}

const STEPS: TimelineStep[] = [
  { id: 'placed', label: 'Order Placed', icon: Clock, description: 'Artisans notified' },
  { id: 'confirmed', label: 'Confirmed', icon: ShieldCheck, description: 'Quality inspection queued' },
  { id: 'processing', label: 'Crafting', icon: Package, description: 'Hand-finishing details' },
  { id: 'shipped', label: 'In Transit', icon: Truck, description: 'Secure insured delivery' },
  { id: 'delivered', label: 'Delivered', icon: Check, description: 'Handed over' },
];

export function OrderTimeline({ currentStatus }: { currentStatus: OrderStatus }) {
  if (currentStatus === 'cancelled') {
    return (
      <div className="bg-red-50 rounded-3xl p-8 flex items-center space-x-6 border border-red-100">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
          <XCircle size={24} />
        </div>
        <div>
          <h4 className="text-lg font-serif text-red-900">Order Cancelled</h4>
          <p className="text-xs text-red-600 uppercase tracking-widest font-bold">This journey has ended</p>
        </div>
      </div>
    );
  }

  const currentIdx = STEPS.findIndex(s => s.id === currentStatus);

  return (
    <div className="relative pt-12 pb-8 px-4">
      {/* Connector Line */}
      <div className="absolute top-[70px] left-8 right-8 h-[2px] bg-brand-text/5 hidden md:block">
        <div 
          className="h-full bg-brand-gold transition-all duration-1000 ease-out"
          style={{ width: `${(currentIdx / (STEPS.length - 1)) * 100}%` }}
        />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0">
        {STEPS.map((step, idx) => {
          const isCompleted = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex md:flex-col items-center space-x-4 md:space-x-0 md:space-y-4 relative z-10">
              <div className={cn(
                "w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-700 shadow-premium border-2",
                isCompleted 
                  ? "bg-brand-text border-brand-gold text-white" 
                  : "bg-white border-brand-text/5 text-brand-text/20"
              )}>
                <Icon size={isCurrent ? 24 : 20} className={cn(isCurrent && "animate-pulse")} />
              </div>
              
              <div className="text-left md:text-center">
                <p className={cn(
                  "text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-colors duration-500",
                  isCompleted ? "text-brand-text" : "text-brand-text/30"
                )}>
                  {step.label}
                </p>
                <p className="text-[8px] md:text-[9px] text-brand-text/40 uppercase tracking-tighter hidden md:block">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
