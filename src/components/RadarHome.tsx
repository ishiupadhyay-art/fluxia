'use client';
import { useState, useEffect } from 'react';
import { Subscription, CreditCard } from '@/lib/mockData';
import { ArrowRight, Zap } from 'lucide-react';
import { mockCardExpenses } from '@/lib/mockData';
import { mockBudgets, mockFinanceProfile, mockManualExpenses } from '@/lib/mockFinanceData';
import { getUnifiedExpenses, getCategorySummaries, calculateBudgetMetrics } from '@/lib/budgetEngine';
import { generateRecommendations } from '@/lib/recommendationEngine';
import { useCurrency } from '@/lib/currencyContext';

interface RadarHomeProps {
  subscriptions: Subscription[];
  cards: CreditCard[];
  onViewAll: () => void;
  onViewCards: () => void;
}

type ScoreFactor = {
  direction: 'up' | 'down';
  text: string;
};

type ActionItem = {
  icon: string;
  title: string;
  subtitle: string;
  cta: string;
  onClick: () => void;
  urgent: boolean;
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getBand(score: number) {
  if (score >= 85) return { label: 'Excellent', segments: 5, bar: 'bg-emerald-400', text: 'text-emerald-400' };
  if (score >= 70) return { label: 'Good',      segments: 4, bar: 'bg-amber-400',   text: 'text-amber-400'  };
  if (score >= 50) return { label: 'Fair',       segments: 3, bar: 'bg-orange-400',  text: 'text-orange-400' };
  return              { label: 'At Risk',    segments: 2, bar: 'bg-rose-500',    text: 'text-rose-400'   };
}

export default function RadarHome({ subscriptions, cards, onViewAll, onViewCards }: RadarHomeProps) {
  const { symbol } = useCurrency();
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedSafe, setAnimatedSafe] = useState(0);

  // Evaluate Budget Engine
  const expenses = getUnifiedExpenses(mockCardExpenses, mockManualExpenses);
  const categorySummaries = getCategorySummaries(expenses, mockBudgets);
  const metrics = calculateBudgetMetrics(categorySummaries, mockFinanceProfile);
  const allAlerts = generateRecommendations(metrics, categorySummaries, subscriptions, mockFinanceProfile.monthlyIncome);
  // Pick out high priority budget alerts that are danger/warning
  const budgetAlerts = allAlerts.filter(a => a.type === 'danger' || a.type === 'warning');

  // ── Subscription maths ─────────────────────────────────────────────────────
  const activeSubs = subscriptions.filter(s => s.status === 'active');
  const totalSubMonthly = activeSubs.reduce((sum, s) => sum + s.monthlyPrice, 0);
  const ghostSubs = activeSubs.filter(s => s.valueScore < 20);
  const ghostDebt = ghostSubs.reduce((sum, s) => sum + s.monthlyPrice, 0);

  // ── Card maths (cashflow model) ────────────────────────────────────────────
  // Minimum payment = max(2% of balance, $25)
  const cardMinPayments = cards.reduce((sum, c) => sum + Math.max(25, c.balance * 0.02), 0);
  const income = mockFinanceProfile.monthlyIncome;
  const safeToSpend = Math.max(0, income - totalSubMonthly - cardMinPayments);
  const commitmentRatio = ((totalSubMonthly + cardMinPayments) / income) * 100;

  const avgUtilization = cards.length
    ? (cards.reduce((sum, c) => sum + c.balance / c.creditLimit, 0) / cards.length) * 100
    : 0;

  const cardsWithDays = cards.map(c => ({
    ...c,
    daysUntil: Math.max(0, Math.ceil(
      (new Date(c.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )),
  }));
  const urgentCards = cardsWithDays
    .filter(c => c.daysUntil <= 7)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  // ── Clarity Score ──────────────────────────────────────────────────────────
  let score = 100;
  if (avgUtilization > 30) score -= 20;
  else if (avgUtilization > 15) score -= 10;
  if (ghostDebt > 50) score -= 15;
  else if (ghostDebt > 20) score -= 10;
  else if (ghostDebt > 0) score -= 5;
  score -= urgentCards.filter(c => c.daysUntil <= 2).length * 10;
  if (commitmentRatio > 70) score -= 15;
  else if (commitmentRatio > 50) score -= 10;
  score = Math.max(0, Math.min(100, score));
  const band = getBand(score);

  // ── Score factors (exactly 3) ──────────────────────────────────────────────
  const factors: ScoreFactor[] = [];

  // Factor 1: card utilization
  if (avgUtilization > 30) {
    factors.push({ direction: 'down', text: `Card utilization at ${Math.round(avgUtilization)}% — aim for under 30%` });
  } else {
    factors.push({ direction: 'up', text: `Healthy card utilization (${Math.round(avgUtilization)}%)` });
  }

  // Factor 2: urgent payments
  if (urgentCards.length > 0 && urgentCards[0].daysUntil <= 2) {
    factors.push({ direction: 'down', text: `${urgentCards[0].name} payment due in ${urgentCards[0].daysUntil} day${urgentCards[0].daysUntil === 1 ? '' : 's'}` });
  } else {
    factors.push({ direction: 'up', text: 'No urgent payments overdue' });
  }

  // Factor 3: ghost subscriptions
  if (ghostDebt > 0) {
    factors.push({ direction: 'down', text: `$${ghostDebt.toFixed(0)} ghost debt — ${ghostSubs.length} unused subscription${ghostSubs.length > 1 ? 's' : ''}` });
  } else {
    factors.push({ direction: 'up', text: 'No ghost subscriptions detected' });
  }

  // ── One thing to do today ──────────────────────────────────────────────────
  let topAction: ActionItem;

  if (budgetAlerts.length > 0 && budgetAlerts[0].priority <= 2) {
    topAction = {
      icon: '🚨',
      title: budgetAlerts[0].title,
      subtitle: budgetAlerts[0].description,
      cta: 'View Budget',
      onClick: onViewCards,
      urgent: true,
    };
  } else if (urgentCards.length > 0 && urgentCards[0].daysUntil <= 2) {
    topAction = {
      icon: '💳',
      title: `${urgentCards[0].name} payment due soon`,
      subtitle: `${symbol}${urgentCards[0].balance.toFixed(2)} owed · due ${urgentCards[0].dueDate}`,
      cta: 'View Cards',
      onClick: onViewCards,
      urgent: true,
    };
  } else if (ghostSubs.length > 0) {
    const biggestGhost = ghostSubs.sort((a, b) => b.monthlyPrice - a.monthlyPrice)[0];
    topAction = {
      icon: biggestGhost.icon,
      title: `${biggestGhost.name} hasn't been used in ${biggestGhost.lastUsedDaysAgo} days`,
      subtitle: `You're paying ${symbol}${biggestGhost.monthlyPrice.toFixed(2)}/mo for nothing`,
      cta: 'Review',
      onClick: onViewAll,
      urgent: false,
    };
  } else if (avgUtilization > 30) {
    const highCard = cardsWithDays.sort((a, b) => (b.balance / b.creditLimit) - (a.balance / a.creditLimit))[0];
    topAction = {
      icon: '💳',
      title: `${highCard.name} is at high utilization`,
      subtitle: `${Math.round((highCard.balance / highCard.creditLimit) * 100)}% used — affects your credit score`,
      cta: 'View Cards',
      onClick: onViewCards,
      urgent: false,
    };
  } else {
    const nextSub = activeSubs.sort((a, b) => a.daysUntilBilling - b.daysUntilBilling)[0];
    topAction = {
      icon: nextSub?.icon ?? '📅',
      title: `${nextSub?.name ?? 'Next charge'} billing soon`,
      subtitle: `${symbol}${nextSub?.monthlyPrice.toFixed(2)} · in ${nextSub?.daysUntilBilling} day${nextSub?.daysUntilBilling === 1 ? '' : 's'}`,
      cta: 'See All',
      onClick: onViewAll,
      urgent: false,
    };
  }

  // ── Merged Next Up list ────────────────────────────────────────────────────
  const upcomingItems = [
    ...activeSubs.map(s => ({
      id: `sub-${s.id}`,
      name: s.name,
      icon: s.icon,
      daysUntil: s.daysUntilBilling,
      amount: s.monthlyPrice,
      type: 'sub' as const,
      isGhost: s.valueScore < 20,
    })),
    ...cardsWithDays.map(c => ({
      id: `card-${c.id}`,
      name: c.name,
      icon: '💳',
      daysUntil: c.daysUntil,
      amount: c.balance,
      type: 'card' as const,
      isGhost: false,
    })),
  ]
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, 5);

  // ── Animations ────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      let s = 0;
      const iv = setInterval(() => {
        s += score / 40;
        if (s >= score) { s = score; clearInterval(iv); }
        setAnimatedScore(Math.round(s));
      }, 16);
      return () => clearInterval(iv);
    }, 200);
    return () => clearTimeout(t);
  }, [score]);

  useEffect(() => {
    const t = setTimeout(() => {
      let s = 0;
      const iv = setInterval(() => {
        s += safeToSpend / 40;
        if (s >= safeToSpend) { s = safeToSpend; clearInterval(iv); }
        setAnimatedSafe(s);
      }, 16);
      return () => clearInterval(iv);
    }, 400);
    return () => clearTimeout(t);
  }, [safeToSpend]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-5">

      {/* Greeting */}
      <p className="text-sm text-slate-400 font-medium">{getGreeting()} 👋</p>

      {/* ── Hero: Clarity Score ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f1a2e] to-[#162040] p-6 border border-white/5">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-blue-500/6 rounded-full blur-3xl pointer-events-none" />

        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Financial Clarity</p>

        {/* Score number + band */}
        <div className="flex items-end gap-3 mb-4">
          <span className={`text-7xl font-bold tracking-tight leading-none ${band.text}`}>
            {animatedScore}
          </span>
          <div className="mb-2">
            <span className="text-slate-500 text-lg font-light">/ 100</span>
            <p className={`text-sm font-semibold ${band.text}`}>{band.label}</p>
          </div>
        </div>

        {/* 5-segment progress bar */}
        <div className="flex gap-1.5 mb-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all duration-700 ${i < band.segments ? band.bar : 'bg-white/10'}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            />
          ))}
        </div>

        {/* Score factors */}
        <div className="flex flex-col gap-2.5">
          {factors.map((f, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className={`text-sm font-bold flex-shrink-0 leading-none mt-0.5 ${f.direction === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {f.direction === 'up' ? '↑' : '↓'}
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Safe to Spend (secondary, cashflow) ─────────────────────────────── */}
      <div className="rounded-2xl bg-white/[0.04] border border-white/[0.07] p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Safe to Spend</p>
          <p className="text-2xl font-bold text-white">{symbol}{animatedSafe.toFixed(0)}</p>
          <p className="text-[10px] text-slate-600 mt-0.5">after subs & card minimums</p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-xs text-slate-500">Subs <span className="text-slate-300 font-medium">{symbol}{totalSubMonthly.toFixed(0)}</span></p>
          <p className="text-xs text-slate-500">Card mins <span className="text-slate-300 font-medium">{symbol}{cardMinPayments.toFixed(0)}</span></p>
          <p className="text-xs text-slate-500">Income <span className="text-slate-300 font-medium">{symbol}{income.toLocaleString()}</span></p>
        </div>
      </div>

      {/* ── One Thing to Do Today ───────────────────────────────────────────── */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">One thing to do today</p>
        <div
          className={`rounded-2xl p-4 border flex items-center gap-3 cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
            topAction.urgent
              ? 'bg-rose-500/8 border-rose-500/20'
              : 'bg-amber-500/8 border-amber-500/20'
          }`}
          onClick={topAction.onClick}
        >
          <span className="text-2xl flex-shrink-0">{topAction.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{topAction.title}</p>
            <p className="text-xs text-slate-400 mt-0.5">{topAction.subtitle}</p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0 ${
            topAction.urgent ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/15 text-amber-400'
          }`}>
            {topAction.cta}
          </span>
        </div>
      </div>

      {/* ── Next Up (subs + card payments merged) ───────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Next Up</p>
          <button
            onClick={onViewAll}
            className="text-[11px] text-amber-400 font-medium flex items-center gap-0.5 hover:text-amber-300 transition-colors"
          >
            See all <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {upcomingItems.map(item => {
            const label = item.daysUntil === 0 ? 'Today' : item.daysUntil === 1 ? 'Tomorrow' : `${item.daysUntil}d`;
            return (
              <div
                key={item.id}
                className={`flex items-center gap-3 rounded-2xl p-3.5 border cursor-pointer transition-all duration-200 hover:bg-white/[0.05] ${
                  item.isGhost
                    ? 'bg-violet-500/5 border-violet-500/15'
                    : item.daysUntil <= 2
                    ? 'bg-rose-500/5 border-rose-500/15'
                    : 'bg-white/[0.03] border-white/[0.05]'
                }`}
                onClick={item.type === 'card' ? onViewCards : onViewAll}
              >
                {/* Urgency dot */}
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  item.daysUntil <= 2 ? 'bg-rose-500 animate-pulse' :
                  item.daysUntil <= 7 ? 'bg-amber-400' :
                  'bg-slate-700'
                }`} />

                <span className="text-lg w-7 text-center flex-shrink-0">{item.icon}</span>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{item.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {item.type === 'card' && (
                      <span className="text-[10px] font-medium text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-full">Card</span>
                    )}
                    {item.isGhost && (
                      <span className="text-[10px] font-medium text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded-full">Unused</span>
                    )}
                    {item.type === 'sub' && !item.isGhost && (
                      <span className="text-[10px] text-slate-600">Subscription</span>
                    )}
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-semibold ${item.daysUntil <= 2 ? 'text-rose-400' : 'text-white'}`}>
                    {symbol}{item.amount.toFixed(2)}
                  </p>
                  <p className={`text-[11px] font-medium ${
                    item.daysUntil <= 2 ? 'text-rose-400' :
                    item.daysUntil <= 7 ? 'text-amber-400' :
                    'text-slate-500'
                  }`}>
                    {label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
