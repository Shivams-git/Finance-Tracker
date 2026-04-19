import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const FinanceContext = createContext();

const SAMPLE_DATA = [
  { id: uuidv4(), title: 'Monthly Salary', amount: 45000, category: 'Income', type: 'income', date: '2024-01-01', notes: 'January salary', recurring: true },
  { id: uuidv4(), title: 'Netflix Subscription', amount: 649, category: 'Subscriptions', type: 'expense', date: '2024-01-03', notes: '', recurring: true },
  { id: uuidv4(), title: 'Grocery Shopping', amount: 2800, category: 'Food', type: 'expense', date: '2024-01-05', notes: 'Monthly groceries', recurring: false },
  { id: uuidv4(), title: 'Rent Payment', amount: 12000, category: 'Rent', type: 'expense', date: '2024-01-06', notes: 'January rent', recurring: true },
  { id: uuidv4(), title: 'Gym Membership', amount: 1200, category: 'Health', type: 'expense', date: '2024-01-08', notes: 'Fitness monthly', recurring: true },
  { id: uuidv4(), title: 'Freelance Project', amount: 15000, category: 'Income', type: 'income', date: '2024-01-10', notes: 'Web design project', recurring: false },
  { id: uuidv4(), title: 'Electricity Bill', amount: 1800, category: 'Utilities', type: 'expense', date: '2024-01-12', notes: '', recurring: true },
  { id: uuidv4(), title: 'Online Shopping', amount: 3500, category: 'Shopping', type: 'expense', date: '2024-01-15', notes: 'Clothes and accessories', recurring: false },
  { id: uuidv4(), title: 'Movie Night', amount: 800, category: 'Entertainment', type: 'expense', date: '2024-01-18', notes: 'Cinema with friends', recurring: false },
  { id: uuidv4(), title: 'Bus/Metro Pass', amount: 500, category: 'Travel', type: 'expense', date: '2024-01-20', notes: 'Monthly transit', recurring: true },
  { id: uuidv4(), title: 'Doctor Visit', amount: 600, category: 'Health', type: 'expense', date: '2024-01-22', notes: '', recurring: false },
  { id: uuidv4(), title: 'Zomato / Swiggy', amount: 1400, category: 'Food', type: 'expense', date: '2024-01-25', notes: 'Food delivery', recurring: false },
];

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('finance_transactions');
      return saved ? JSON.parse(saved) : SAMPLE_DATA;
    } catch { return SAMPLE_DATA; }
  });

  const [budget, setBudget] = useState(() => {
    try {
      const saved = localStorage.getItem('finance_budget');
      return saved ? JSON.parse(saved) : { monthlyBudget: 50000 };
    } catch { return { monthlyBudget: 50000 }; }
  });

  const [currency, setCurrency] = useState('INR');
  const [exchangeRates, setExchangeRates] = useState({});
  const [ratesLoading, setRatesLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finance_budget', JSON.stringify(budget));
  }, [budget]);

  const addTransaction = useCallback((data) => {
    const newTx = { ...data, id: uuidv4() };
    setTransactions(prev => [newTx, ...prev]);
    return newTx;
  }, []);

  const updateTransaction = useCallback((id, data) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, ...data } : tx));
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  }, []);

  const updateBudget = useCallback((newBudget) => {
    setBudget({ monthlyBudget: Number(newBudget) });
  }, []);

  const fetchExchangeRates = useCallback(async (base = 'INR') => {
    setRatesLoading(true);
    try {
      const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`);
      const data = await res.json();
      setExchangeRates(data.rates || {});
    } catch (e) {
      console.error('Exchange rate fetch failed:', e);
    } finally {
      setRatesLoading(false);
    }
  }, []);

  return (
    <FinanceContext.Provider value={{
      transactions, addTransaction, updateTransaction, deleteTransaction,
      budget, updateBudget,
      currency, setCurrency,
      exchangeRates, fetchExchangeRates, ratesLoading
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider');
  return ctx;
}
