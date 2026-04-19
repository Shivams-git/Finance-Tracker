import React from 'react'
import { motion } from 'framer-motion'
import { useBudget } from '../../hooks'
import { useFinance } from '../../context/FinanceContext'
import { SpendingPieChart, MonthlyTrendChart, IncomeExpenseBar } from '../../components/Charts/Charts'
import StatCard from '../../components/StatCard/StatCard'
import { formatCurrency } from '../../utils/currencyFormatter'
import {
  RiArrowUpCircleLine, RiArrowDownCircleLine,
  RiMoneyDollarCircleLine, RiTrophyLine,
} from 'react-icons/ri'
import './Analytics.css'

export default function Analytics() {
  const {
    totalIncome, totalExpenses, netBalance,
    topCategory, categoryData, monthlyTrend
  } = useBudget()

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">Your financial insights</p>
      </motion.div>

      {/* PRD: Key metrics — Total Income, Total Expenses, Net Balance, Top spending category */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        {[
          { icon: <RiArrowUpCircleLine />,    label: 'Total Income',    value: formatCurrency(totalIncome),   color: 'var(--green)' },
          { icon: <RiArrowDownCircleLine />,  label: 'Total Expenses',  value: formatCurrency(totalExpenses), color: 'var(--red)'   },
          { icon: <RiMoneyDollarCircleLine />,label: 'Net Balance',     value: formatCurrency(netBalance),    color: netBalance >= 0 ? 'var(--green)' : 'var(--red)' },
          { icon: <RiTrophyLine />,           label: 'Top Category',    value: topCategory,                   color: 'var(--yellow)' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* PRD: Pie chart + Line chart */}
      <div className="analytics-grid-2" style={{ marginBottom: 16 }}>
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="section-header">
            <span className="section-title">Spending by Category</span>
          </div>
          <SpendingPieChart data={categoryData} />
        </motion.div>

        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="section-header">
            <span className="section-title">Monthly Spending Trend</span>
          </div>
          <MonthlyTrendChart data={monthlyTrend} />
        </motion.div>
      </div>

      {/* PRD: Bar chart — income vs expense comparison */}
      <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div className="section-header">
          <span className="section-title">Income vs Expenses</span>
        </div>
        <IncomeExpenseBar data={monthlyTrend} />
      </motion.div>
    </div>
  )
}
