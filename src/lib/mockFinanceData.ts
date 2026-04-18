export interface UserFinanceProfile {
  id: string;
  monthlyIncome: number;
  savingsGoalPct: number;
  currency: string;
}

export interface Budget {
  id: string;
  category: string;
  monthlyLimit: number;
  monthYear: string;
}

export interface ManualExpense {
  id: string;
  merchant: string;
  amount: number;
  category: string;
  date: string;
  icon: string;
  isCash: boolean;
}

export const mockFinanceProfile: UserFinanceProfile = {
  id: 'user_123',
  monthlyIncome: 3500,
  savingsGoalPct: 20, // 20%
  currency: 'USD',
};

export const mockBudgets: Budget[] = [
  { id: 'b1', category: 'Food & Dining', monthlyLimit: 500, monthYear: '2026-04' },
  { id: 'b2', category: 'Groceries', monthlyLimit: 300, monthYear: '2026-04' },
  { id: 'b3', category: 'Transport', monthlyLimit: 150, monthYear: '2026-04' },
  { id: 'b4', category: 'Entertainment', monthlyLimit: 200, monthYear: '2026-04' },
  { id: 'b5', category: 'Shopping', monthlyLimit: 150, monthYear: '2026-04' },
  { id: 'b6', category: 'Education', monthlyLimit: 400, monthYear: '2026-04' },
  { id: 'b7', category: 'Travel', monthlyLimit: 500, monthYear: '2026-04' },
];

export const mockManualExpenses: ManualExpense[] = [
  // These represent things bought with cash (after the ATM withdrawal)
  { id: 'm1', merchant: 'Street Food Cart', amount: 15.00, category: 'Food & Dining', date: '2026-04-15', icon: '🌮', isCash: true },
  { id: 'm2', merchant: 'Flea Market', amount: 35.00, category: 'Shopping', date: '2026-04-16', icon: '👕', isCash: true },
];
