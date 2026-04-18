import { CardExpense } from './mockData';
import { Budget, ManualExpense, UserFinanceProfile } from './mockFinanceData';

export interface UnifiedExpense {
  id: string;
  merchant: string;
  amount: number;
  category: string;
  date: string;
  icon: string;
  source: 'card' | 'manual';
  cardId?: string;
  isCash?: boolean;
}

export interface CategorySummary {
  category: string;
  spent: number;
  budgetLimit: number;
  remaining: number;
  percentUsed: number;
  status: 'safe' | 'warning' | 'danger';
}

/**
 * Unifies Card and Manual expenses.
 * Filters out Card transactions that are ATM/Cash Withdrawals to avoid double counting.
 */
export function getUnifiedExpenses(
  cardExpenses: CardExpense[],
  manualExpenses: ManualExpense[]
): UnifiedExpense[] {
  const processCardExps = cardExpenses
    .filter(exp => {
      const isAtmCategory = exp.category.toUpperCase().includes('ATM') || 
                            exp.category.toUpperCase().includes('CASH WITHDRAWAL') ||
                            exp.category.toUpperCase().includes('CASH ADVANCE');
                            
      const isAtmMerchant = exp.merchant.toUpperCase().includes('ATM') ||
                            exp.merchant.toUpperCase().includes('WITHDRAWAL');

      return !(isAtmCategory || isAtmMerchant);
    })
    .map(exp => ({
      ...exp,
      source: 'card' as const,
      cardId: exp.cardId
    }));

  const processManualExps = manualExpenses.map(exp => ({
    ...exp,
    source: 'manual' as const,
    isCash: exp.isCash
  }));

  return [...processCardExps, ...processManualExps].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Groups expenses by category and matches them against budgets.
 */
export function getCategorySummaries(
  expenses: UnifiedExpense[],
  budgets: Budget[]
): CategorySummary[] {
  const summaries: Record<string, CategorySummary> = {};

  // Initialize with budgets
  for (const b of budgets) {
    summaries[b.category] = {
      category: b.category,
      spent: 0,
      budgetLimit: b.monthlyLimit,
      remaining: b.monthlyLimit,
      percentUsed: 0,
      status: 'safe',
    };
  }

  // Aggregate expenses
  for (const exp of expenses) {
    if (!summaries[exp.category]) {
      // If expense category doesn't have a budget, create a dummy one with 0 limit
      summaries[exp.category] = {
        category: exp.category,
        spent: 0,
        budgetLimit: 0,
        remaining: 0,
        percentUsed: 0,
        status: 'danger',
      };
    }
    summaries[exp.category].spent += exp.amount;
  }

  // Recalculate remaining and percentages
  for (const cat in summaries) {
    const s = summaries[cat];
    s.remaining = Math.max(0, s.budgetLimit - s.spent);
    s.percentUsed = s.budgetLimit > 0 ? (s.spent / s.budgetLimit) * 100 : (s.spent > 0 ? 100 : 0);
    
    if (s.percentUsed >= 100) {
      s.status = 'danger';
    } else if (s.percentUsed >= 80) {
      s.status = 'warning';
    } else {
      s.status = 'safe';
    }
  }

  return Object.values(summaries).sort((a, b) => b.spent - a.spent);
}

/**
 * High-level metrics for the Budget Tab (e.g. burn rates, savings projections)
 */
export function calculateBudgetMetrics(
  summaries: CategorySummary[],
  profile: UserFinanceProfile
) {
  const totalBudgeted = summaries.reduce((sum, cat) => sum + cat.budgetLimit, 0);
  const totalSpent = summaries.reduce((sum, cat) => sum + cat.spent, 0);
  const totalRemaining = Math.max(0, totalBudgeted - totalSpent);
  
  const currentDate = new Date('2026-04-18'); // Using current sprint date from mock
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const daysElapsed = currentDate.getDate();
  
  const dailyBurnRate = daysElapsed > 0 ? totalSpent / daysElapsed : 0;
  const projectedMonthlySpend = dailyBurnRate * daysInMonth;
  
  const savingsGoalAmount = profile.monthlyIncome * (profile.savingsGoalPct / 100);
  const projectedSavings = Math.max(0, profile.monthlyIncome - projectedMonthlySpend);
  
  return {
    totalBudgeted,
    totalSpent,
    totalRemaining,
    dailyBurnRate,
    projectedMonthlySpend,
    savingsGoalAmount,
    projectedSavings,
    daysElapsed,
    daysInMonth,
    daysRemaining: daysInMonth - daysElapsed
  };
}
