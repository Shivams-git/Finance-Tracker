import { useState, useEffect, useMemo, useCallback } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/currencyFormatter';
import { isWithinInterval, parseISO, startOfMonth, endOfMonth } from 'date-fns';

// ---- useDebounce ----
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ---- useTransactions ----
export function useTransactions() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  const debouncedSearch = useDebounce(searchQuery, 300);

  const filtered = useMemo(() => {
    let result = [...transactions];

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(tx =>
        tx.title.toLowerCase().includes(q) ||
        (tx.notes && tx.notes.toLowerCase().includes(q))
      );
    }

    if (filterCategory !== 'All') {
      result = result.filter(tx => tx.category === filterCategory);
    }

    if (filterType !== 'All') {
      result = result.filter(tx => tx.type === filterType);
    }

    if (filterDateFrom && filterDateTo) {
      result = result.filter(tx => {
        try {
          const d = parseISO(tx.date);
          return isWithinInterval(d, { start: parseISO(filterDateFrom), end: parseISO(filterDateTo) });
        } catch { return true; }
      });
    }

    result.sort((a, b) => {
      let av, bv;
      if (sortBy === 'date') { av = new Date(a.date); bv = new Date(b.date); }
      else if (sortBy === 'amount') { av = a.amount; bv = b.amount; }
      else if (sortBy === 'category') { av = a.category; bv = b.category; }
      else { av = a.title; bv = b.title; }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [transactions, debouncedSearch, filterCategory, filterType, filterDateFrom, filterDateTo, sortBy, sortDir]);

  return {
    transactions, filtered,
    searchQuery, setSearchQuery,
    filterCategory, setFilterCategory,
    filterType, setFilterType,
    filterDateFrom, setFilterDateFrom,
    filterDateTo, setFilterDateTo,
    sortBy, setSortBy,
    sortDir, setSortDir,
    addTransaction, updateTransaction, deleteTransaction
  };
}

// ---- useBudget ----
export function useBudget() {
  const { transactions, budget, updateBudget } = useFinance();

  const analytics = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const monthTx = transactions.filter(tx => {
      try {
        const d = parseISO(tx.date);
        return isWithinInterval(d, { start: monthStart, end: monthEnd });
      } catch { return false; }
    });

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const netBalance = totalIncome - totalExpenses;

    const monthlyExpenses = monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const remainingBudget = budget.monthlyBudget - monthlyExpenses;
    const budgetUsedPct = budget.monthlyBudget > 0 ? Math.min((monthlyExpenses / budget.monthlyBudget) * 100, 100) : 0;

    const categoryMap = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });
    const topCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0];

    const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

    // Monthly trend (last 6 months)
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mStart = startOfMonth(d);
      const mEnd = endOfMonth(d);
      const mLabel = d.toLocaleDateString('en', { month: 'short', year: '2-digit' });
      const mTx = transactions.filter(tx => {
        try {
          const txd = parseISO(tx.date);
          return isWithinInterval(txd, { start: mStart, end: mEnd });
        } catch { return false; }
      });
      monthlyTrend.push({
        month: mLabel,
        income: mTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
        expenses: mTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      });
    }

    return {
      totalIncome, totalExpenses, netBalance,
      monthlyExpenses, remainingBudget, budgetUsedPct,
      topCategory: topCategory ? topCategory[0] : 'N/A',
      categoryData, monthlyTrend
    };
  }, [transactions, budget]);

  return { budget, updateBudget, ...analytics };
}

// ---- useCurrency ----
export function useCurrency() {
  const { currency } = useFinance();

  const format = useCallback((amount) => {
    return formatCurrency(amount, currency);
  }, [currency]);

  return { format, currency };
}
