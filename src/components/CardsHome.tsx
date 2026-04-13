import React from 'react';
import { CreditCard as CreditCardIcon, AlertTriangle, CheckCircle2, ChevronRight, Calendar } from 'lucide-react';
import { mockCards, mockCardExpenses, CreditCard } from '@/lib/mockData';

export default function CardsHome() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Card Maximizer</h2>
          <p className="text-sm text-slate-400">Optimize spending & rewards</p>
        </div>
      </div>

      {/* Card Stack / Carousel */}
      <div className="flex overflow-x-auto pb-4 -mx-5 px-5 snap-x snap-mandatory gap-4 hide-scrollbar">
        {mockCards.map((card) => (
          <div
            key={card.id}
            className={`min-w-[280px] sm:min-w-[320px] snap-center h-48 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br ${card.colorGrad} ring-1 ring-white/10 shadow-2xl`}
          >
            {/* Glassmorphic overlay */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>
            
            <div className="relative z-10 flex justify-between items-start">
              <span className="font-semibold text-white/90 tracking-wide text-sm">{card.name}</span>
              <span className="text-white/80 font-mono text-sm">{card.network}</span>
            </div>
            
            <div className="relative z-10">
              <p className="text-white/60 text-xs mb-1">Current Balance</p>
              <h3 className="text-2xl font-bold text-white">${card.balance.toFixed(2)}</h3>
              <p className="text-white/40 text-xs tracking-widest mt-2">•••• •••• •••• {card.digits}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Utilization Rings */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Credit Utilization
        </h3>
        
        <div className="space-y-4">
          {mockCards.map((card) => {
            const ratio = card.balance / card.creditLimit;
            const percentage = Math.round(ratio * 100);
            
            let statusColor = "bg-green-500";
            let textColor = "text-green-400";
            if (percentage > 30) {
              statusColor = "bg-red-500";
              textColor = "text-red-400";
            } else if (percentage > 10) {
              statusColor = "bg-amber-500";
              textColor = "text-amber-400";
            }

            return (
              <div key={`util-${card.id}`} className="flex flex-col gap-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{card.name}</span>
                  <span className={`${textColor} font-bold`}>{percentage}% Used</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`${statusColor} h-2 rounded-full transition-all duration-1000`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>${card.balance.toFixed(0)}</span>
                  <span>Limit: ${(card.creditLimit / 1000).toFixed(0)}k</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Payments timeline */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-400" />
          Upcoming Due Dates
        </h3>
        <div className="space-y-3">
          {mockCards.sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map(card => {
             const daysUntil = Math.ceil((new Date(card.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
             return (
              <div key={`due-${card.id}`} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${card.colorGrad}`}>
                    <CreditCardIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-200">{card.name}</h4>
                    <p className="text-xs text-slate-400">Due {card.dueDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">${card.balance.toFixed(2)}</p>
                  <p className={`text-xs ${daysUntil <= 5 ? 'text-amber-400' : 'text-slate-500'}`}>
                    {daysUntil} days left
                  </p>
                </div>
              </div>
             )
          })}
        </div>
      </div>

      {/* Recent expenses summary map */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-200">Recent Aggregated Spends</h3>
          <button className="text-xs text-amber-400 flex items-center">
            View All <ChevronRight className="w-3 h-3 ml-1" />
          </button>
        </div>
        <div className="space-y-3">
          {mockCardExpenses.map(expense => {
            const card = mockCards.find(c => c.id === expense.cardId);
            return (
              <div key={expense.id} className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm border border-white/5">
                    {expense.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-200">{expense.merchant}</h4>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                       <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${card?.colorGrad}`}></span>
                       {card?.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">${expense.amount.toFixed(2)}</p>
                  <p className="text-xs text-slate-500">{expense.date}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  );
}
