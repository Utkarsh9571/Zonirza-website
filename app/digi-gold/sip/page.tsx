'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Coins, Target, Info, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/new-ui/Button';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function CreateSIP() {
  const router = useRouter();
  const [monthlyAmount, setMonthlyAmount] = useState<number>(5000);
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState<number | ''>('');
  
  const [forecast, setForecast] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const calculateForecast = async () => {
      setIsCalculating(true);
      // Client-side simulation of the forecast
      const estimatedRate = 0.08;
      const currentRate = 7000;
      let acc = 0;
      let inv = 0;
      const milestones = [];
      for (let i = 1; i <= 60; i++) {
        const rate = currentRate * Math.pow(1 + estimatedRate, i / 12);
        acc += monthlyAmount / rate;
        inv += monthlyAmount;
        if (i % 12 === 0) milestones.push({ year: i / 12, value: acc * rate, invested: inv });
      }
      setForecast({ 
        projectedValue: acc * (currentRate * Math.pow(1 + estimatedRate, 5)), 
        projectedGrams: acc,
        totalInvested: inv,
        milestones 
      });
      setIsCalculating(false);
    };

    const timer = setTimeout(calculateForecast, 500);
    return () => clearTimeout(timer);
  }, [monthlyAmount]);

  const handleCreateSIP = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/digi-gold/sip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthlyAmount,
          goalName: goalName || undefined,
          targetAmount: targetAmount ? Number(targetAmount) : undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        router.push('/account/digi-gold');
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to start SIP');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen pt-32 pb-20 text-brand-text">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        
        <button onClick={() => router.back()} className="flex items-center text-[10px] uppercase tracking-widest font-bold text-brand-text/50 hover:text-brand-text mb-8">
          <ChevronLeft size={16} className="mr-1" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Form Side */}
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
              <h1 className="text-4xl font-serif mb-2">Automate Your Legacy</h1>
              <p className="text-brand-text/60">Set up a recurring Systemic Investment Plan (SIP) in 24K Digital Gold. Grow your wealth effortlessly.</p>
            </div>

            <div className="space-y-8 bg-white p-8 rounded-[40px] border border-brand-text/5 shadow-soft">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-brand-text/70 mb-4">Monthly Investment</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-serif text-brand-gold">₹</span>
                  <input 
                    type="number" 
                    value={monthlyAmount}
                    onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                    className="w-full pl-14 pr-6 py-6 bg-brand-bg rounded-3xl text-3xl font-serif text-brand-text border-2 border-transparent focus:border-brand-gold focus:outline-none transition-all"
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  {[2000, 5000, 10000, 25000].map(amt => (
                    <button 
                      key={amt}
                      onClick={() => setMonthlyAmount(amt)}
                      className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${monthlyAmount === amt ? 'bg-brand-text text-white' : 'bg-brand-bg text-brand-text/60 hover:bg-brand-text/5'}`}
                    >
                      ₹{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-brand-text/5">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-brand-text/70 mb-4 flex items-center">
                  <Target size={14} className="mr-2" /> Set a Goal (Optional)
                </label>
                <input 
                  type="text" 
                  placeholder="e.g., Anniversary Gift, Child's Wedding"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  className="w-full px-6 py-4 bg-brand-bg rounded-xl text-sm border border-transparent focus:border-brand-gold focus:outline-none transition-all mb-4"
                />
                {goalName && (
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/40">₹</span>
                    <input 
                      type="number" 
                      placeholder="Target Amount"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full pl-8 pr-6 py-4 bg-brand-bg rounded-xl text-sm border border-transparent focus:border-brand-gold focus:outline-none transition-all"
                    />
                  </div>
                )}
              </div>

              <Button 
                size="lg" 
                onClick={handleCreateSIP}
                disabled={monthlyAmount < 100 || isSubmitting}
                className="w-full !py-6 shadow-premium text-sm"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Start SIP Plan'}
              </Button>
              <p className="text-[10px] text-center text-brand-text/40 flex items-center justify-center"><Info size={12} className="mr-1" /> Initial installment will be due immediately.</p>
            </div>
          </div>

          {/* Forecasting Side */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="bg-[#1a1614] rounded-[40px] p-8 md:p-10 text-white shadow-premium relative overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="mb-8 relative z-10">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-brand-gold mb-1 flex items-center"><Sparkles size={14} className="mr-2" /> 5-Year Projection</h3>
                <p className="text-white/40 text-xs">Based on conservative 8% annual growth</p>
              </div>

              {isCalculating || !forecast ? (
                <div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin text-brand-gold" /></div>
              ) : (
                <div className="flex-1 flex flex-col justify-between relative z-10">
                  <div className="grid grid-cols-2 gap-8 mb-10">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/50 mb-2">Projected Value</p>
                      <p className="text-4xl font-serif text-brand-gold">₹{(forecast.projectedValue / 100000).toFixed(1)}L</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/50 mb-2">Gold Accumulated</p>
                      <p className="text-4xl font-serif text-white">{forecast.projectedGrams.toFixed(1)} <span className="text-lg">g</span></p>
                    </div>
                  </div>

                  <div className="h-[200px] w-full mt-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={forecast.milestones} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} tickFormatter={(val) => `Yr ${val}`} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} tickFormatter={(val) => `₹${val/1000}k`} />
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-[#111] p-3 rounded-lg border border-brand-gold/20">
                                  <p className="text-brand-gold font-serif text-sm">₹{payload[0].value?.toLocaleString()}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorProjected)" />
                        <Area type="monotone" dataKey="invested" stroke="#666" strokeWidth={2} strokeDasharray="4 4" fill="transparent" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-8 p-4 bg-brand-gold/10 rounded-xl border border-brand-gold/20 flex items-start">
                    <AlertCircle size={16} className="text-brand-gold mr-3 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-brand-gold/80 leading-relaxed uppercase tracking-widest font-bold">
                      Projections are informational. Actual returns depend on market gold rates.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
