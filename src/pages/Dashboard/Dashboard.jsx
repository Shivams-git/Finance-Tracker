import React from 'react'
import { Link } from 'react-router-dom'
import { RiArrowRightSLine, RiAddLine, RiRepeatLine } from 'react-icons/ri'
import { motion } from 'framer-motion'
import { useBudget } from '../../hooks'
import { useFinance } from '../../context/FinanceContext'
import BudgetCard from '../../components/BudgetCard/BudgetCard'
import TransactionCard from '../../components/TransactionCard/TransactionCard'
import { SpendingPieChart } from '../../components/Charts/Charts'
import { formatCurrency } from '../../utils/currencyFormatter'
import { toast } from 'react-toastify'
import './Dashboard.css'

const stagger = { show: { transition: { staggerChildren: 0.07 } } }
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4,0,0.2,1] } }
}

export default function Dashboard() {
  const {
    totalIncome, totalExpenses, netBalance,
    monthlyExpenses, remainingBudget, budgetUsedPct,
    topCategory, categoryData, budget
  } = useBudget()

  const { transactions, deleteTransaction } = useFinance()

  const recent    = transactions.slice(0, 6)
  const recurring = transactions.filter(t => t.recurring).slice(0, 5)

  const handleDelete = (id) => {
    deleteTransaction(id)
    toast.success('Deleted')
  }

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>

      {/* Hero — key metrics from PRD: Total Income, Total Expenses, Net Balance, Top spending category */}
      <motion.div variants={fadeUp} className="dashboard-hero">
        <div className="dashboard-hero-glow" />
        <div className="hero-balance-label">Net Balance</div>
        <div className={`hero-balance ${netBalance >= 0 ? 'positive' : 'negative'}`}>
          {formatCurrency(netBalance)}
        </div>
        <div className="hero-stats">
          <div className="hero-stat-item">
            <div className="hero-stat-label">Total Income</div>
            <div className="hero-stat-val amount-positive">{formatCurrency(totalIncome)}</div>
          </div>
          <div className="hero-stat-item">
            <div className="hero-stat-label">Total Expenses</div>
            <div className="hero-stat-val amount-negative">{formatCurrency(totalExpenses)}</div>
          </div>
          <div className="hero-stat-item">
            <div className="hero-stat-label">Top Category</div>
            <div className="hero-stat-val" style={{ color: 'var(--text)' }}>{topCategory}</div>
          </div>
        </div>
      </motion.div>

      <div className="dashboard-body">

        {/* Recent Transactions */}
        <motion.div variants={fadeUp}>
          <div className="tx-list-card">
            <div className="tx-list-header">
              <div>
                <div className="section-title">Recent Transactions</div>
                <div className="section-subtitle">{transactions.length} total transactions</div>
              </div>
              <Link to="/transactions/new" className="btn btn-primary btn-sm">
                <RiAddLine /> Add
              </Link>
            </div>

            {recent.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">💸</div>
                <h3>No transactions yet</h3>
                <p>Start tracking by adding your first transaction</p>
              </div>
            ) : (
              <div className="tx-list-body">
                {recent.map(tx => (
                  <TransactionCard
                    key={tx.id} tx={tx}
                    onEdit={() => toast.info('Edit via Transactions page')}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}

            <Link to="/transactions" className="view-all-link">
              View all transactions <RiArrowRightSLine />
            </Link>
          </div>
        </motion.div>

        {/* Sidebar */}
        <div className="dashboard-sidebar">

          {/* Budget Tracking — PRD Feature 6 */}
          <motion.div variants={fadeUp} className="card">
            <div className="section-header">
              <div className="section-title">Monthly Budget</div>
              <Link to="/budget" className="btn btn-ghost btn-sm">Manage</Link>
            </div>
            <BudgetCard
              monthlyBudget={budget.monthlyBudget}
              monthlyExpenses={monthlyExpenses}
              remainingBudget={remainingBudget}
              budgetUsedPct={budgetUsedPct}
            />
          </motion.div>

          {/* Spending by Category pie — PRD Feature 7 */}
          <motion.div variants={fadeUp} className="card">
            <div className="section-header">
              <div className="section-title">Spending by Category</div>
              <Link to="/analytics" className="btn btn-ghost btn-sm">Analytics</Link>
            </div>
            <SpendingPieChart data={categoryData} />
          </motion.div>

          {/* Recurring Expenses — PRD Feature 8 */}
          {recurring.length > 0 && (
            <motion.div variants={fadeUp} className="card">
              <div className="section-header">
                <div>
                  <div className="section-title">Recurring Expenses</div>
                  <div className="section-subtitle">{recurring.length} active</div>
                </div>
                <RiRepeatLine style={{ color: 'var(--yellow)', fontSize: '1.1rem' }} />
              </div>
              <div className="recurring-list">
                {recurring.map(tx => (
                  <div key={tx.id} className="recurring-item">
                    <div>
                      <div className="recurring-name">{tx.title}</div>
                      <div className="recurring-freq">Monthly</div>
                    </div>
                    <div className={`recurring-amount ${tx.type === 'income' ? 'amount-positive' : 'amount-negative'}`}>
                      {tx.type === 'expense' ? '-' : '+'}{formatCurrency(tx.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </motion.div>
  )
}
