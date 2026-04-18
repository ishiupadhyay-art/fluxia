import { Subscription } from './mockData';
import { CategorySummary } from './budgetEngine';

export interface Recommendation {
  id: string;
  type: 'danger' | 'warning' | 'success' | 'info';
  title: string;
  description: string;
  actionText?: string;
  priority: number;
}

export function generateRecommendations(
  metrics: any, // Return type from calculateBudgetMetrics
  summaries: CategorySummary[],
  subscriptions: Subscription[],
  income: number
): Recommendation[] {
  const recs: Recommendation[] = [];

  // Rule 1: Category spending > 40% of income
  const highSpendCategory = summaries.find(s => (s.spent / income) > 0.4);
  if (highSpendCategory) {
    recs.push({
      id: 'high-spend-ratio',
      type: 'danger',
      title: `${highSpendCategory.category} is ${Math.round((highSpendCategory.spent / income) * 100)}% of income`,
      description: `Consider reducing this to ~25% to free up cash.`,
      actionText: 'Review Spending',
      priority: 1
    });
  }

  // Rule 2: Projected overspend this month
  if (metrics.projectedMonthlySpend > income) {
    const overspend = metrics.projectedMonthlySpend - income;
    recs.push({
      id: 'projected-overspend',
      type: 'danger',
      title: `On track to overspend by $${Math.round(overspend)}`,
      description: `Your daily burn rate is too high. Dial back on non-essentials for the next ${metrics.daysRemaining} days.`,
      priority: 2
    });
  }

  // Rule 3: Savings goal not on track
  if (metrics.projectedSavings < metrics.savingsGoalAmount && metrics.projectedMonthlySpend <= income) {
    const shortfall = metrics.savingsGoalAmount - metrics.projectedSavings;
    recs.push({
      id: 'savings-shortfall',
      type: 'warning',
      title: `Savings goal at risk`,
      description: `Save $${Math.round(shortfall)} more this month to hit your ${Math.round((metrics.savingsGoalAmount/income)*100)}% goal.`,
      priority: 3
    });
  }

  // Rule 4: High budget utilization alerts
  const overBudgetCat = summaries.find(s => s.percentUsed >= 100);
  if (overBudgetCat) {
    recs.push({
      id: 'budget-exceeded',
      type: 'warning',
      title: `${overBudgetCat.category} budget exceeded`,
      description: `You've spent $${Math.round(overBudgetCat.spent)} on a $${Math.round(overBudgetCat.budgetLimit)} limit.`,
      priority: 4
    });
  }

  // Rule 5: Low daily spend available
  if (metrics.totalRemaining > 0 && metrics.daysRemaining > 0) {
    const dailyLeft = metrics.totalRemaining / metrics.daysRemaining;
    if (dailyLeft < metrics.dailyBurnRate && dailyLeft < 20) {
      recs.push({
        id: 'low-daily-available',
        type: 'info',
        title: `Only $${dailyLeft.toFixed(0)}/day left`,
        description: `Try to keep daily spending tight for the rest of the month.`,
        priority: 5
      });
    }
  }

  // Rule 6: All looking good (Fallback if no critical issues)
  if (recs.length === 0) {
    recs.push({
      id: 'all-good',
      type: 'success',
      title: `You're on track! 🎉`,
      description: `Keep up the good habits. Your projected savings look solid.`,
      priority: 6
    });
  }

  return recs.sort((a, b) => a.priority - b.priority);
}
