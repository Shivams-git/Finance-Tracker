import React from 'react';
import { formatCurrency } from '../../utils/currencyFormatter';
import './BudgetCard.css';

export default function BudgetCard({ monthlyBudget, monthlyExpenses, remainingBudget, budgetUsedPct }) {
  const isOver = remainingBudget < 0;
  const barColor = budgetUsedPct > 90 ? 'var(--red)' : budgetUsedPct > 70 ? 'var(--yellow)' : 'var(--green)';

  return (
    <div className="budget-card card">
      <div className="budget-header">
        <div>
          <div className="budget-label">Monthly Budget</div>
          <div className="budget-amount">{formatCurrency(monthlyBudget)}</div>
        </div>
        <div className={`budget-pct ${isOver ? 'over' : ''}`}>
          {budgetUsedPct.toFixed(1)}%
        </div>
      </div>

      <div className="budget-bar-wrap">
        <div className="budget-bar-bg">
          <div
            className="budget-bar-fill"
            style={{ width: `${Math.min(budgetUsedPct, 100)}%`, background: barColor }}
          />
        </div>
      </div>

      <div className="budget-stats">
        <div className="budget-stat">
          <div className="budget-stat-label">Spent</div>
          <div className="budget-stat-val amount-negative">{formatCurrency(monthlyExpenses)}</div>
        </div>
        <div className="budget-stat">
          <div className="budget-stat-label">{isOver ? 'Overspent' : 'Remaining'}</div>
          <div className={`budget-stat-val ${isOver ? 'amount-negative' : 'amount-positive'}`}>
            {formatCurrency(Math.abs(remainingBudget))}
          </div>
        </div>
      </div>

      {isOver && (
        <div className="budget-warning">
          ⚠️ You've exceeded your monthly budget!
        </div>
      )}
    </div>
  );
}
