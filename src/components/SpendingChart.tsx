import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { CategorySummary } from '@/lib/budgetEngine';
import { useCurrency } from '@/lib/currencyContext';

interface SpendingChartProps {
  summaries: CategorySummary[];
}

const COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899', '#6366F1'];

export function SpendingDonut({ summaries }: SpendingChartProps) {
  const { symbol } = useCurrency();
  
  const data = summaries
    .filter(s => s.spent > 0)
    .map((s, i) => ({
      name: s.category,
      value: s.spent,
      color: COLORS[i % COLORS.length]
    }));

  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center border border-dashed border-white/10 rounded-2xl">
        <p className="text-slate-500 text-sm">No expenses yet</p>
      </div>
    );
  }

  return (
    <div className="h-48 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${symbol}${value.toFixed(2)}`, 'Spent']}
            contentStyle={{ backgroundColor: '#0f1a2e', borderColor: '#1e293b', borderRadius: '12px' }}
            itemStyle={{ color: '#fff' }}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xs text-slate-500">Total Spent</span>
        <span className="text-lg font-bold text-white">
          {symbol}{data.reduce((sum, item) => sum + item.value, 0).toFixed(0)}
        </span>
      </div>
    </div>
  );
}

export function CategoryBars({ summaries }: SpendingChartProps) {
  const { symbol } = useCurrency();
  
  return (
    <div className="space-y-4">
      {summaries.slice(0,4).map((s, i) => {
        const colorClass = 
          s.status === 'danger' ? 'bg-rose-500' :
          s.status === 'warning' ? 'bg-amber-400' : 
          'bg-emerald-400';
          
        return (
          <div key={s.category} className="flex flex-col gap-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">{s.category}</span>
              <span className="text-slate-400 font-medium">
                {symbol}{s.spent.toFixed(0)} / <span className="text-slate-600">{symbol}{s.budgetLimit.toFixed(0)}</span>
              </span>
            </div>
            {/* Progress Bar Container */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${colorClass} transition-all duration-1000`}
                style={{ width: `${Math.min(100, s.percentUsed)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
