import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { RiArrowLeftLine, RiCheckLine } from 'react-icons/ri';
import { useFinance } from '../../context/FinanceContext';
import { CATEGORIES } from '../../utils/currencyFormatter';
import './AddTransaction.css';

const schema = yup.object({
  title: yup.string().required('Title is required').min(2, 'Too short'),
  amount: yup.number().typeError('Must be a number').positive('Must be positive').required('Amount is required'),
  category: yup.string().required('Category is required'),
  type: yup.string().oneOf(['income', 'expense']).required(),
  date: yup.string().required('Date is required'),
  notes: yup.string().default(''),
  recurring: yup.boolean().default(false),
});

export default function AddTransaction() {
  const navigate = useNavigate();
  const { addTransaction } = useFinance();
  const today = new Date().toISOString().split('T')[0];

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: 'expense',
      date: today,
      category: 'Food',
      recurring: false,
      notes: '',
    }
  });

  const txType = watch('type');

  const onSubmit = async (data) => {
    await new Promise(r => setTimeout(r, 300)); // simulate async
    addTransaction(data);
    toast.success('Transaction added successfully! 🎉');
    navigate('/transactions');
  };

  return (
    <div className="add-tx-page">
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
        <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
          <RiArrowLeftLine /> Back
        </button>
        <h1 className="page-title">Add Transaction</h1>
        <p className="page-subtitle">Record a new income or expense</p>
      </motion.div>

      <motion.div
        className="card add-tx-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Type Switcher */}
        <div className="type-switcher">
          <label className={`type-option ${txType === 'expense' ? 'active-expense' : ''}`}>
            <input type="radio" value="expense" {...register('type')} />
            <span>Expense</span>
          </label>
          <label className={`type-option ${txType === 'income' ? 'active-income' : ''}`}>
            <input type="radio" value="income" {...register('type')} />
            <span>Income</span>
          </label>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="add-tx-form">
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                className="form-input"
                placeholder="e.g. Netflix Subscription"
                {...register('title')}
              />
              {errors.title && <span className="form-error">{errors.title.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Amount (₹) *</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                placeholder="0.00"
                {...register('amount')}
              />
              {errors.amount && <span className="form-error">{errors.amount.message}</span>}
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="form-input" {...register('category')}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <span className="form-error">{errors.category.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input type="date" className="form-input" {...register('date')} />
              {errors.date && <span className="form-error">{errors.date.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Optional notes about this transaction..."
              {...register('notes')}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-group">
            <label className="recurring-check">
              <input type="checkbox" {...register('recurring')} />
              <div className="recurring-check-text">
                <span className="form-label" style={{ margin: 0, textTransform: 'none', letterSpacing: 0 }}>Mark as Recurring</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>This transaction repeats monthly (e.g. rent, subscriptions)</span>
              </div>
            </label>
          </div>

          <div className="add-tx-actions">
            <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Saving...</>
              ) : (
                <><RiCheckLine /> Add Transaction</>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
