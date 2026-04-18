'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Currency = 'USD' | 'AUD' | 'SGD' | 'MYR' | 'GBP' | 'EUR' | 'INR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  symbol: string;
  format: (amount: number) => string;
}

const currencySymbols: Record<Currency, string> = {
  USD: '$',
  AUD: 'A$',
  SGD: 'S$',
  MYR: 'RM',
  GBP: '£',
  EUR: '€',
  INR: '₹',
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('USD');

  useEffect(() => {
    const saved = localStorage.getItem('fluxia_currency') as Currency;
    if (saved && currencySymbols[saved]) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('fluxia_currency', c);
  };

  const symbol = currencySymbols[currency];
  
  const format = (amount: number) => {
    return `${symbol}${amount.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, symbol, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
