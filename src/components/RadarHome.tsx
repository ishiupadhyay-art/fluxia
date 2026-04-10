'use client';
import { useState, useEffect } from 'react';
import { Subscription } from '@/lib/mockData';
import { Shield, TrendingDown, Zap } from 'lucide-react';

interface RadarHomeProps {
  subscriptions: Subscription[];
  onViewAll: () => void;
}

export default function RadarHome({ subscriptions, onViewAll }: RadarHomeProps) {
  const [animatedAmount, setAnimatedAmount] = useState(0);

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const totalMonthly = activeSubscriptions.reduce((sum, s) => sum + s.monthlyPrice, 0);
  const ghostDebt = activeSubscriptions.filter(s => s.valueScore < 20).reduce((sum, s) => sum + s.monthlyPrice, 0);
  const safeToSpend = 4200 - totalMonthly;

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const interval = setInterval(() => {
        current += safeToSpend / 30;
        if (current >= safeToSpend) {
          current = safeToSpend;
          clearInterval(interval);
        }
        setAnimatedAmount(current);
      }, 20);
      return () => clearInterval(interval);
    }, 300);
    return () => clearTimeout(timer);
  }, [safeToSpend]);

  const timelineDays = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const billingsToday = activeSubscriptions.filter(s => s.daysUntilBilling === i + 1);
    return { day: i + 1, date, billings: billingsToday };
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Safe-to-Spend */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f1a2e] to-[#162040] p-6 border border-white/5">
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />

        <p className="text-sm font-medium text-slate-400 mb-1">Safe to Spend</p>
        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
          {'$'}{animatedAmount.toFixed(0)}
        </h1>
        <p className="text-sm text-slate-500 mt-1">after all upcoming subscriptions</p>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-white/5 rounded-2xl p-3 text-center backdrop-blur-sm">
            <Shield className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <p className="text-lg font-semibold text-white">{activeSubscriptions.length}</p>
            <p className="text-xs text-slate-500">Active</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 text-center backdrop-blur-sm">
            <TrendingDown className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <p className="text-lg font-semibold text-white">{'$'}{totalMonthly.toFixed(0)}</p>
            <p className="text-xs text-slate-500">/month</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 text-center backdrop-blur-sm">
            <Zap className="w-5 h-5 text-rose-400 mx-auto mb-1" />
            <p className="text-lg font-semibold text-white">{'$'}{ghostDebt.toFixed(0)}</p>
            <p className="text-xs text-slate-500">Ghost Debt</p>
          </div>
        </div>
      </div>

      {/* 30-Day Timeline */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-300">30-Day Radar</h2>
          <button onClick={onViewAll} className="text-xs text-amber-400 font-medium hover:text-amber-300 transition-colors">
            View All Subscriptions
          </button>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
          {timelineDays.map((day) => {
            const hasBilling = day.billings.length > 0;
            const isGhost = day.billings.some(b => b.valueScore < 20);
            return (
              <div
                key={day.day}
                className={`flex-shrink-0 flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${
                  hasBilling
                    ? isGhost
                      ? 'bg-rose-500/15 border border-rose-500/30 shadow-lg shadow-rose-500/10'
                      : 'bg-amber-500/15 border border-amber-500/30 shadow-lg shadow-amber-500/10'
                    : 'bg-white/[0.03] border border-transparent'
                }`}
                style={{ minWidth: '44px' }}
              >
                <span className="text-[10px] text-slate-500">
                  {day.date.toLocaleDateString('en', { weekday: 'narrow' })}
                </span>
                <span className={`text-xs font-semibold ${hasBilling ? (isGhost ? 'text-rose-400' : 'text-amber-400') : 'text-slate-600'}`}>
                  {day.day}
                </span>
                {hasBilling && (
                  <div className={`w-1.5 h-1.5 rounded-full ${isGhost ? 'bg-rose-400 animate-pulse' : 'bg-amber-400'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Charges */}
      <div>
        <h2 className="text-sm font-semibold text-slate-300 mb-3">Upcoming Charges</h2>
        <div className="flex flex-col gap-2">
          {activeSubscriptions
            .sort((a, b) => a.daysUntilBilling - b.daysUntilBilling)
            .slice(0, 4)
            .map((sub) => (
              <div key={sub.id} className="flex items-center justify-between bg-white/[0.03] rounded-2xl p-4 border border-white/5 hover:bg-white/[0.06] transition-all duration-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{sub.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{sub.name}</p>
                    <p className="text-xs text-slate-500">
                      {sub.daysUntilBilling === 1 ? 'Tomorrow' : `in ${sub.daysUntilBilling} days`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{'$'}{sub.monthlyPrice.toFixed(2)}</p>
                  {sub.valueScore < 20 && (
                    <span className="text-[10px] text-rose-400 font-medium">Low Value</span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
