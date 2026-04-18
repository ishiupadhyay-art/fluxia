'use client';

import React, { useState, useMemo } from 'react';
import { CreditCard as CreditCardIcon, Plus } from 'lucide-react';
import { mockCards, mockCardExpenses, subscriptions } from '@/lib/mockData';
import { mockBudgets, mockManualExpenses, mockFinanceProfile, ManualExpense } from '@/lib/mockFinanceData';
import { getUnifiedExpenses, getCategorySummaries, calculateBudgetMetrics } from '@/lib/budgetEngine';
import { generateRecommendations } from '@/lib/recommendationEngine';
import AIRecommendations from './AIRecommendations';
import CashEntryModal from './CashEntryModal';
import { SpendingDonut, CategoryBars } from './SpendingChart';
import { useCurrency } from '@/lib/currencyContext';

export default function BudgetPage() {
  const { symbol } = useCurrency();
  const [manualExps, setManualExps] = useState<ManualExpense[]>(mockManualExpenses);
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);

  // Core Engine calculations
  const expenses = useMemo(() => getUnifiedExpenses(mockCardExpenses, manualExps), [manualExps]);
  const categorySummaries = useMemo(() => getCategorySummaries(expenses, mockBudgets), [expenses]);
  const metrics = useMemo(() => calculateBudgetMetrics(categorySummaries, mockFinanceProfile), [categorySummaries]);
  
  // Recommendations calculation
  const alerts = useMemo(() => generateRecommendations(metrics, categorySummaries, subscriptions, mockFinanceProfile.monthlyIncome), [metrics, categorySummaries]);

  const handleAddExpense = (exp: ManualExpense) => {
    setManualExps(prev => [exp, ...prev]);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8 relative">
      
      {/* Cash Modal Trigger */}
      <button 
        onClick={() => setIsCashModalOpen(true)}
        className="absolute top-0 right-0 p-2 bg-amber-500/20 text-amber-400 rounded-full hover:bg-amber-500/30 transition-colors"
      >
        <Plus className="w-5 h-5" />
      </button>

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Budget & Spends</h2>
        <p className="text-sm text-slate-400">Card & cashflow maximizer</p>
      </div>

      {/* Recommended Actions */}
      <AIRecommendations recommendations={alerts} />

      {/* Budget Overview Hero */}
      <div className="grid grid-cols-2 gap-3 mt-2">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-xs text-slate-500 mb-1">Left to Spend</p>
          <p className="text-2xl font-bold text-white">{symbol}{metrics.totalRemaining.toFixed(0)}</p>
          <div className="mt-2 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-400 rounded-full" 
              style={{ width: `${(metrics.totalSpent / metrics.totalBudgeted) * 100}%` }} 
            />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-xs text-slate-500 mb-1">Projected Savings</p>
          <p className={`text-2xl font-bold ${metrics.projectedSavings >= metrics.savingsGoalAmount ? 'text-emerald-400' : 'text-amber-400'}`}>
            {symbol}{metrics.projectedSavings.toFixed(0)}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">Goal: {symbol}{metrics.savingsGoalAmount.toFixed(0)}</p>
        </div>
      </div>

      {/* Visualization Tab */}
      <div className="bg-[#121A2F]/50 border border-white/5 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Spending Breakdown</h3>
        <div className="flex flex-col gap-6">
          <SpendingDonut summaries={categorySummaries} />
          <div className="h-px w-full bg-white/5" />
          <CategoryBars summaries={categorySummaries} />
        </div>
      </div>

      {/* Card Carousel (Retained from original CardsHome) */}
      <div className="mt-2">
        <h3 className="text-sm font-semibold text-slate-200 mb-3 px-1">Your Cards</h3>
        <div className="flex overflow-x-auto pb-4 -mx-5 px-5 snap-x snap-mandatory gap-4 hide-scrollbar">
          {mockCards.map((card) => (
            <div
              key={card.id}
              className={`min-w-[280px] sm:min-w-[320px] snap-center h-36 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br ${card.colorGrad} ring-1 ring-white/10 shadow-lg`}
            >
              <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>
              
              <div className="relative z-10 flex justify-between items-start">
                <span className="font-semibold text-white/90 tracking-wide text-sm">{card.name}</span>
                <span className="text-white/80 font-mono text-sm">{card.network}</span>
              </div>
              
              <div className="relative z-10 flex justify-between items-end">
                <div>
                  <p className="text-white/60 text-xs mb-0.5">Current Balance</p>
                  <h3 className="text-xl font-bold text-white">{symbol}{card.balance.toFixed(2)}</h3>
                </div>
                <p className="text-white/40 text-xs tracking-widest text-right">•••• {card.digits}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity List */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-slate-200 mb-3">Recent Activity</h3>
        <div className="space-y-4">
          {expenses.slice(0, 5).map(expense => {
            const card = expense.source === 'card' ? mockCards.find(c => c.id === expense.cardId) : null;
            return (
              <div key={expense.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg border ${
                    expense.source === 'manual' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-slate-800 border-white/5'
                  }`}>
                    {expense.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-200">{expense.merchant}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {expense.source === 'manual' ? (
                        <span className="text-amber-400/80">Cash Transaction</span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${card?.colorGrad}`}></span>
                          {card?.name}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{symbol}{expense.amount.toFixed(2)}</p>
                  <p className="text-[10px] text-slate-500">{expense.date}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <CashEntryModal 
        isOpen={isCashModalOpen} 
        onClose={() => setIsCashModalOpen(false)} 
        onAdd={handleAddExpense} 
      />

    </div>
  );
}
