'use client';
import { Subscription, categories, categoryIcons } from '@/lib/mockData';
import { ChevronRight, Pause, ArrowLeft } from 'lucide-react';

interface CategoryFeedProps {
  subscriptions: Subscription[];
  onPause: (sub: Subscription) => void;
  onBack: () => void;
}

export default function CategoryFeed({ subscriptions, onPause, onBack }: CategoryFeedProps) {
  const getValueColor = (score: number) => {
    if (score >= 70) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (score >= 40) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
  };

  const getValueLabel = (score: number) => {
    if (score >= 70) return 'High Value';
    if (score >= 40) return 'Medium';
    return 'Low Value';
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-4 h-4 text-slate-400" />
        </button>
        <h1 className="text-lg font-bold text-white">All Subscriptions</h1>
      </div>

      {categories.map((category) => {
        const catSubs = subscriptions.filter(s => s.category === category);
        if (catSubs.length === 0) return null;
        const catTotal = catSubs.filter(s => s.status === 'active').reduce((s, sub) => s + sub.monthlyPrice, 0);
        const icon = categoryIcons[category] || '';

        return (
          <div key={category}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{icon}</span>
                <h2 className="text-sm font-semibold text-slate-300">{category}</h2>
              </div>
              <span className="text-xs text-slate-500">{'$'}{catTotal.toFixed(2)}/mo</span>
            </div>

            <div className="flex flex-col gap-2">
              {catSubs.map((sub) => (
                <div
                  key={sub.id}
                  className={`relative flex items-center justify-between rounded-2xl p-4 border transition-all duration-300 hover:scale-[1.01] ${
                    sub.status === 'paused'
                      ? 'bg-white/[0.02] border-white/5 opacity-60'
                      : 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{sub.icon}</span>
                    <div>
                      <p className={`text-sm font-medium ${sub.status === 'paused' ? 'text-slate-500 line-through' : 'text-white'}`}>{sub.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${getValueColor(sub.valueScore)}`}>
                          {getValueLabel(sub.valueScore)}
                        </span>
                        {sub.lastUsedDaysAgo > 14 && sub.status === 'active' && (
                          <span className="text-[10px] text-slate-600">
                            Not used in {sub.lastUsedDaysAgo}d
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">{'$'}{sub.monthlyPrice.toFixed(2)}</p>
                      <p className="text-[10px] text-slate-600">
                        {sub.status === 'paused' ? 'Paused' : `in ${sub.daysUntilBilling}d`}
                      </p>
                    </div>
                    {sub.status === 'active' && sub.valueScore < 50 && (
                      <button
                        onClick={() => onPause(sub)}
                        className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all duration-200 group"
                      >
                        <Pause className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                      </button>
                    )}
                    {sub.status === 'active' && sub.valueScore >= 50 && (
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
