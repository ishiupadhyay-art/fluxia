import React from 'react';
import { Recommendation } from '@/lib/recommendationEngine';
import { AlertCircle, TrendingDown, Target, Zap, CheckCircle2 } from 'lucide-react';

interface AIRecommendationsProps {
  recommendations: Recommendation[];
}

export default function AIRecommendations({ recommendations }: AIRecommendationsProps) {
  if (!recommendations || recommendations.length === 0) return null;

  const topRec = recommendations[0];

  const getIcon = (type: string) => {
    switch (type) {
      case 'danger': return <TrendingDown className="w-5 h-5 text-rose-400" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-amber-400" />;
      case 'info': return <Zap className="w-5 h-5 text-blue-400" />;
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      default: return <Target className="w-5 h-5 text-slate-400" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'danger': return 'bg-rose-500/10 border-rose-500/20';
      case 'warning': return 'bg-amber-500/10 border-amber-500/20';
      case 'info': return 'bg-blue-500/10 border-blue-500/20';
      case 'success': return 'bg-emerald-500/10 border-emerald-500/20';
      default: return 'bg-white/5 border-white/10';
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <Zap className="w-3 h-3 text-white fill-white" />
        </div>
        <h3 className="text-sm font-semibold text-slate-200">AI Insights</h3>
      </div>

      <div className={`p-4 rounded-2xl border ${getBgColor(topRec.type)} flex flex-col gap-2 relative overflow-hidden`}>
        {/* Abstract shape */}
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex items-start gap-3 relative z-10">
          <div className="mt-0.5">{getIcon(topRec.type)}</div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-white">{topRec.title}</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{topRec.description}</p>
          </div>
        </div>
        
        {topRec.actionText && (
          <div className="mt-2 ml-8 relative z-10">
            <button className="text-[11px] font-semibold tracking-wider uppercase text-white bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors">
              {topRec.actionText}
            </button>
          </div>
        )}
      </div>

      {recommendations.length > 1 && (
        <div className="grid grid-cols-2 gap-2 mt-1">
          {recommendations.slice(1, 3).map((rec) => (
            <div key={rec.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2">
              <div className="mt-0.5 opacity-70 scale-75 origin-top-left">{getIcon(rec.type)}</div>
              <div>
                <h4 className="text-xs font-semibold text-slate-200 leading-tight">{rec.title}</h4>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
