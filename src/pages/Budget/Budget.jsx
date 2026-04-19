import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { RiSaveLine, RiExchangeLine } from 'react-icons/ri';
import { useBudget } from '../../hooks';
import BudgetCard from '../../components/BudgetCard/BudgetCard';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, CURRENCIES } from '../../utils/currencyFormatter';
import './Budget.css';

export default function Budget() {
  const { budget, updateBudget, monthlyExpenses, remainingBudget, budgetUsedPct } = useBudget();
  const { transactions, fetchExchangeRates, exchangeRates, ratesLoading } = useFinance();

  const [inputBudget, setInputBudget] = useState(budget.monthlyBudget);
  const [targetCurrency, setTargetCurrency] = useState('USD');

  useEffect(() => {
    fetchExchangeRates('INR');
  }, [fetchExchangeRates]);

  const handleSave = () => {
    if (inputBudget <= 0) { toast.error('Budget must be positive'); return; }
    updateBudget(inputBudget);
    toast.success('Budget updated!');
  };

  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);

  const convertAmount = (inr) => {
    if (!exchangeRates[targetCurrency]) return 'N/A';
    return formatCurrency(inr * exchangeRates[targetCurrency], targetCurrency);
  };

  const categoryTotals = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });
  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">Budget Tracker</h1>
        <p className="page-subtitle">Manage your monthly spending limits</p>
      </motion.div>

      <div className="budget-page-grid">
        <motion.div className="budget-left" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          {/* Budget Card */}
          <BudgetCard
            monthlyBudget={budget.monthlyBudget}
            monthlyExpenses={monthlyExpenses}
            remainingBudget={remainingBudget}
            budgetUsedPct={budgetUsedPct}
          />

          {/* Set Budget */}
          <div className="card" style={{ marginTop: 20 }}>
            <h3 className="section-title" style={{ marginBottom: 16 }}>Set Monthly Budget</h3>
            <div className="form-group">
              <label className="form-label">Budget Amount (₹)</label>
              <input
                type="number"
                className="form-input"
                value={inputBudget}
                onChange={e => setInputBudget(Number(e.target.value))}
                placeholder="e.g. 50000"
              />
            </div>
            <button className="btn btn-primary" onClick={handleSave} style={{ width: '100%' }}>
              <RiSaveLine /> Save Budget
            </button>
          </div>

          {/* Currency Converter */}
          <div className="card" style={{ marginTop: 20 }}>
            <div className="section-header">
              <span className="section-title"><RiExchangeLine style={{ marginRight: 6, color: 'var(--accent)' }} />Currency Converter</span>
              {ratesLoading && <div className="spinner" />}
            </div>
            <div className="form-group">
              <label className="form-label">Convert to</label>
              <select className="form-input" value={targetCurrency} onChange={e => setTargetCurrency(e.target.value)}>
                {CURRENCIES.filter(c => c !== 'INR').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {!ratesLoading && exchangeRates[targetCurrency] && (
              <div className="conversion-results">
                <div className="conversion-row">
                  <span className="conv-label">Total Income</span>
                  <span className="conv-val amount-positive">{convertAmount(totalIncome)}</span>
                </div>
                <div className="conversion-row">
                  <span className="conv-label">Total Expenses</span>
                  <span className="conv-val amount-negative">{convertAmount(totalExpenses)}</span>
                </div>
                <div className="conversion-row">
                  <span className="conv-label">Monthly Budget</span>
                  <span className="conv-val">{convertAmount(budget.monthlyBudget)}</span>
                </div>
                <div className="conv-rate">
                  1 INR = {exchangeRates[targetCurrency]?.toFixed(4)} {targetCurrency}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div className="budget-right" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <div className="card">
            <h3 className="section-title" style={{ marginBottom: 20 }}>Category Breakdown</h3>
            {sortedCategories.length === 0 ? (
              <div className="empty-state"><h3>No expense data</h3></div>
            ) : (
              <div className="category-breakdown">
                {sortedCategories.map(([cat, amount]) => {
                  const pct = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                  return (
                    <div key={cat} className="category-row">
                      <div className="category-row-info">
                        <span className="category-row-name">{cat}</span>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text3)' }}>{pct.toFixed(1)}%</span>
                          <span className="category-row-amount amount-negative">{formatCurrency(amount)}</span>
                        </div>
                      </div>
                      <div className="category-bar-bg">
                        <motion.div
                          className="category-bar-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="card" style={{ marginTop: 20 }}>
            <h3 className="section-title" style={{ marginBottom: 16 }}>Financial Summary</h3>
            <div className="summary-grid">
              {[
                { label: 'Total Transactions', val: transactions.length, color: 'var(--accent)' },
                { label: 'Total Income', val: formatCurrency(totalIncome), color: 'var(--green)' },
                { label: 'Total Expenses', val: formatCurrency(totalExpenses), color: 'var(--red)' },
                { label: 'Net Savings', val: formatCurrency(totalIncome - totalExpenses), color: totalIncome >= totalExpenses ? 'var(--green)' : 'var(--red)' },
                { label: 'Savings Rate', val: totalIncome > 0 ? `${(((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)}%` : '—', color: 'var(--yellow)' },
                { label: 'Recurring Items', val: transactions.filter(t => t.recurring).length, color: 'var(--accent2)' },
              ].map((item, i) => (
                <div key={i} className="summary-item">
                  <div className="summary-label">{item.label}</div>
                  <div className="summary-val" style={{ color: item.color }}>{item.val}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}