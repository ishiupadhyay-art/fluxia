import React, { useState } from 'react';
import { X, DollarSign, Calendar as CalendarIcon, Tag, Store } from 'lucide-react';
import { useCurrency } from '@/lib/currencyContext';

interface CashEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (expense: any) => void;
}

const CATEGORIES = [
  { name: 'Food & Dining', icon: '🍔' },
  { name: 'Groceries', icon: '🛒' },
  { name: 'Transport', icon: '🚕' },
  { name: 'Entertainment', icon: '🎬' },
  { name: 'Shopping', icon: '🛍️' },
  { name: 'Education', icon: '📚' },
  { name: 'Other', icon: '📦' },
];

export default function CashEntryModal({ isOpen, onClose, onAdd }: CashEntryModalProps) {
  const { symbol } = useCurrency();
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !merchant) return;

    onAdd({
      id: `m_${Date.now()}`,
      merchant,
      amount: parseFloat(amount),
      category: category.name,
      date,
      icon: category.icon,
      isCash: true
    });
    
    // Reset and close
    setAmount('');
    setMerchant('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-[#0B1120]/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-[#162040] border border-white/10 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Log Cash Expense</h3>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 font-medium mb-1.5 block">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">{symbol}</span>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#0B1120] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white text-lg font-medium focus:outline-none focus:border-amber-500/50"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-medium mb-1.5 block">Merchant</label>
            <div className="relative">
              <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                className="w-full bg-[#0B1120] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-amber-500/50"
                placeholder="e.g. Campus Coffee"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-medium mb-1.5 block">Category</label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
              {CATEGORIES.map(cat => (
                <div
                  key={cat.name}
                  onClick={() => setCategory(cat)}
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border text-sm transition-colors ${
                    category.name === cat.name 
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                      : 'bg-white/5 border-transparent text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span className="truncate">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-medium mb-1.5 block">Date</label>
            <div className="relative">
              <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#0B1120] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-amber-500/50 appearance-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold text-sm hover:from-amber-400 hover:to-amber-300 transition-colors shadow-lg shadow-amber-500/20"
          >
            Save Expense
          </button>
        </form>
      </div>
    </div>
  );
}
