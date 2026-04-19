import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { RiAddLine, RiCloseLine, RiEqualizerLine } from 'react-icons/ri'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useTransactions } from '../../hooks'
import TransactionCard from '../../components/TransactionCard/TransactionCard'
import SearchBar from '../../components/SearchBar/SearchBar'
import Filters from '../../components/Filters/Filters'
import { CATEGORIES } from '../../utils/currencyFormatter'
import './Transactions.css'

const schema = yup.object({
  title: yup.string().required('Title is required'),
  amount: yup.number().positive().required('Amount is required'),
  category: yup.string().required(),
  type: yup.string().oneOf(['income','expense']).required(),
  date: yup.string().required(),
  notes: yup.string(),
  recurring: yup.boolean(),
})

function EditModal({ tx, onClose, onSave }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { ...tx, recurring: tx.recurring || false }
  })

  const onSubmit = (data) => {
    onSave(tx.id, data)
    toast.success('Transaction updated')
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-box"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.2, ease: [0.4,0,0.2,1] }}
      >
        <div className="modal-header">
          <div className="modal-title">Edit Transaction</div>
          <button className="modal-close" onClick={onClose}><RiCloseLine /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="form-input" {...register('title')} />
              {errors.title && <span className="form-error">{errors.title.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input type="number" className="form-input" {...register('amount')} />
              {errors.amount && <span className="form-error">{errors.amount.message}</span>}
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-input" {...register('type')}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input" {...register('category')}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" className="form-input" {...register('date')} />
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <input className="form-input" {...register('notes')} placeholder="Optional..." />
            </div>
          </div>
          <div className="form-group">
            <label className="recurring-check">
              <input type="checkbox" {...register('recurring')} />
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Mark as Recurring</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: 2 }}>Repeats monthly</div>
              </div>
            </label>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function Transactions() {
  const {
    filtered, searchQuery, setSearchQuery,
    filterCategory, setFilterCategory,
    filterType, setFilterType,
    filterDateFrom, setFilterDateFrom,
    filterDateTo, setFilterDateTo,
    sortBy, setSortBy, sortDir, setSortDir,
    deleteTransaction, updateTransaction
  } = useTransactions()

  const [editTx, setEditTx] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  const handleDelete = (id) => {
    if (window.confirm('Delete this transaction?')) {
      deleteTransaction(id)
      toast.success('Deleted')
    }
  }

  return (
    <div>
      <h1 className="page-title">Transactions</h1>
      <p className="page-subtitle">Your complete financial history</p>

      <div className="tx-toolbar">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <button className={`btn btn-ghost btn-sm`} onClick={() => setShowFilters(f => !f)}>
          <RiEqualizerLine /> {showFilters ? 'Hide' : 'Filter'}
        </button>
        <Link to="/transactions/new" className="btn btn-primary btn-sm">
          <RiAddLine /> Add New
        </Link>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', marginBottom: 8 }}
          >
            <Filters
              filterCategory={filterCategory} setFilterCategory={setFilterCategory}
              filterType={filterType} setFilterType={setFilterType}
              filterDateFrom={filterDateFrom} setFilterDateFrom={setFilterDateFrom}
              filterDateTo={filterDateTo} setFilterDateTo={setFilterDateTo}
              sortBy={sortBy} setSortBy={setSortBy}
              sortDir={sortDir} setSortDir={setSortDir}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="tx-page-card">
        <div className="tx-count-bar">
          <span className="tx-count-text">{filtered.length} results</span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>Nothing found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="tx-page-list">
            <AnimatePresence>
              {filtered.map((tx, i) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i < 20 ? i * 0.015 : 0 }}
                >
                  <TransactionCard tx={tx} onEdit={setEditTx} onDelete={handleDelete} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {editTx && (
          <EditModal tx={editTx} onClose={() => setEditTx(null)} onSave={updateTransaction} />
        )}
      </AnimatePresence>
    </div>
  )
}
