export interface Subscription {
  id: string;
  name: string;
  icon: string;
  category: string;
  monthlyPrice: number;
  nextBillingDate: string;
  daysUntilBilling: number;
  status: 'active' | 'paused';
  lastUsedDaysAgo: number;
  valueScore: number;
}

export const subscriptions: Subscription[] = [
  { id: '1', name: 'Netflix', icon: '🎬', category: 'Entertainment & Games', monthlyPrice: 15.49, nextBillingDate: '2026-04-15', daysUntilBilling: 5, status: 'active', lastUsedDaysAgo: 1, valueScore: 82 },
  { id: '2', name: 'Spotify', icon: '🎵', category: 'Entertainment & Games', monthlyPrice: 10.99, nextBillingDate: '2026-04-18', daysUntilBilling: 8, status: 'active', lastUsedDaysAgo: 0, valueScore: 95 },
  { id: '3', name: 'Xbox Game Pass', icon: '🎮', category: 'Entertainment & Games', monthlyPrice: 16.99, nextBillingDate: '2026-04-22', daysUntilBilling: 12, status: 'active', lastUsedDaysAgo: 14, valueScore: 35 },
  { id: '4', name: 'Headspace', icon: '🧘', category: 'Health & Wellness', monthlyPrice: 12.99, nextBillingDate: '2026-04-12', daysUntilBilling: 2, status: 'active', lastUsedDaysAgo: 21, valueScore: 18 },
  { id: '5', name: 'Strava', icon: '🏃', category: 'Health & Wellness', monthlyPrice: 11.99, nextBillingDate: '2026-04-25', daysUntilBilling: 15, status: 'active', lastUsedDaysAgo: 3, valueScore: 72 },
  { id: '6', name: 'Coursera Plus', icon: '📚', category: 'Learning', monthlyPrice: 59.00, nextBillingDate: '2026-04-14', daysUntilBilling: 4, status: 'active', lastUsedDaysAgo: 30, valueScore: 12 },
  { id: '7', name: 'Duolingo Pro', icon: '🦉', category: 'Learning', monthlyPrice: 6.99, nextBillingDate: '2026-04-20', daysUntilBilling: 10, status: 'active', lastUsedDaysAgo: 2, valueScore: 88 },
  { id: '8', name: 'Adobe Creative Cloud', icon: '🎨', category: 'Ghost Debt', monthlyPrice: 54.99, nextBillingDate: '2026-04-11', daysUntilBilling: 1, status: 'active', lastUsedDaysAgo: 45, valueScore: 5 },
  { id: '9', name: 'Calm', icon: '🌙', category: 'Ghost Debt', monthlyPrice: 14.99, nextBillingDate: '2026-04-16', daysUntilBilling: 6, status: 'active', lastUsedDaysAgo: 60, valueScore: 3 },
  { id: '10', name: 'ChatGPT Plus', icon: '🤖', category: 'Tech Tools & AI', monthlyPrice: 20.00, nextBillingDate: '2026-04-19', daysUntilBilling: 9, status: 'active', lastUsedDaysAgo: 0, valueScore: 97 },
  { id: '11', name: 'Notion', icon: '📝', category: 'Tech Tools & AI', monthlyPrice: 10.00, nextBillingDate: '2026-04-21', daysUntilBilling: 11, status: 'active', lastUsedDaysAgo: 1, valueScore: 90 },
  { id: '12', name: 'Grammarly', icon: '✍️', category: 'Tech Tools & AI', monthlyPrice: 12.00, nextBillingDate: '2026-04-28', daysUntilBilling: 18, status: 'paused', lastUsedDaysAgo: 35, valueScore: 22 },
];

export const categories = ['Entertainment & Games', 'Health & Wellness', 'Learning', 'Ghost Debt', 'Tech Tools & AI'];

export const categoryIcons: Record<string, string> = {
  'Entertainment & Games': '🎭',
  'Health & Wellness': '💚',
  'Learning': '🎓',
  'Ghost Debt': '👻',
  'Tech Tools & AI': '⚡',
};

// --- CARD HUB MOCK DATA ---
export interface CreditCard {
  id: string;
  name: string;
  network: 'Visa' | 'Mastercard' | 'Amex' | 'Discover';
  balance: number;
  creditLimit: number;
  dueDate: string;
  colorGrad: string; // Tailwind gradient classes
  digits: string;
}

export const mockCards: CreditCard[] = [
  {
    id: 'c1',
    name: 'Chase Sapphire Reserve',
    network: 'Visa',
    balance: 1450.50,
    creditLimit: 25000,
    dueDate: '2026-04-20',
    colorGrad: 'from-blue-900 to-slate-900',
    digits: '4123'
  },
  {
    id: 'c2',
    name: 'Amex Gold',
    network: 'Amex',
    balance: 850.00,
    creditLimit: 15000,
    dueDate: '2026-04-18',
    colorGrad: 'from-amber-600 to-amber-800',
    digits: '1004'
  },
  {
    id: 'c3',
    name: 'Citi Custom Cash',
    network: 'Mastercard',
    balance: 4200.75,
    creditLimit: 6000,
    dueDate: '2026-04-25',
    colorGrad: 'from-cyan-800 to-blue-700',
    digits: '8991'
  }
];

export interface CardExpense {
  id: string;
  cardId: string;
  merchant: string;
  amount: number;
  date: string;
  category: string;
  icon: string;
}

export const mockCardExpenses: CardExpense[] = [
  { id: 'e1', cardId: 'c2', merchant: 'Whole Foods', amount: 84.50, date: '2026-04-10', category: 'Groceries', icon: '🛒' },
  { id: 'e2', cardId: 'c1', merchant: 'Delta Airlines', amount: 450.00, date: '2026-04-08', category: 'Travel', icon: '✈️' },
  { id: 'e3', cardId: 'c2', merchant: 'Sweetgreen', amount: 18.90, date: '2026-04-11', category: 'Food & Dining', icon: '🥗' },
  { id: 'e4', cardId: 'c3', merchant: 'Shell Gas', amount: 45.00, date: '2026-04-09', category: 'Transport', icon: '⛽' },
  { id: 'e5', cardId: 'c1', merchant: 'Airbnb', amount: 350.00, date: '2026-04-05', category: 'Travel', icon: '🏨' },
  { id: 'e6', cardId: 'c3', merchant: 'College Bookstore', amount: 120.00, date: '2026-04-12', category: 'Education', icon: '📚' },
  { id: 'e7', cardId: 'c2', merchant: 'Uber', amount: 24.50, date: '2026-04-14', category: 'Transport', icon: '🚕' },
  { id: 'e8', cardId: 'c1', merchant: 'Campus Coffee', amount: 6.50, date: '2026-04-15', category: 'Food & Dining', icon: '☕' },
  { id: 'e9', cardId: 'c3', merchant: 'Movie Theater', amount: 22.00, date: '2026-04-16', category: 'Entertainment', icon: '🎬' },
  // This ATM withdrawal should be filtered out by the budget engine!
  { id: 'e10', cardId: 'c2', merchant: 'Campus ATM Withdrawal', amount: 100.00, date: '2026-04-15', category: 'ATM', icon: '💵' },
];

