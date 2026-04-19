import React from 'react';
import { RiDeleteBinLine, RiEditLine, RiRepeatLine } from 'react-icons/ri';
import { format, parseISO } from 'date-fns';
import { CATEGORY_COLORS } from '../../utils/currencyFormatter';
import { formatCurrency } from '../../utils/currencyFormatter';
import './TransactionCard.css';

export default function TransactionCard({ tx, onEdit, onDelete }) {
  const color = CATEGORY_COLORS[tx.category] || '#9898b8';

  return (
    <div className={`tx-card ${tx.recurring ? 'tx-recurring' : ''}`}>
      <div className="tx-color-bar" style={{ background: color }} />
      <div className="tx-icon" style={{ background: `${color}22`, color }}>
        <span>{tx.category[0]}</span>
      </div>
      <div className="tx-info">
        <div className="tx-title-row">
          <span className="tx-title">{tx.title}</span>
          {tx.recurring && (
            <span className="badge badge-recurring">
              <RiRepeatLine /> recurring
            </span>
          )}
        </div>
        <div className="tx-meta">
          <span className="tx-category">{tx.category}</span>
          <span className="tx-dot">·</span>
          <span className="tx-date">
            {format(parseISO(tx.date), 'dd MMM yyyy')}
          </span>
          {tx.notes && (
            <>
              <span className="tx-dot">·</span>
              <span className="tx-notes">{tx.notes}</span>
            </>
          )}
        </div>
      </div>
      <div className="tx-right">
        <div className={`tx-amount ${tx.type === 'income' ? 'amount-positive' : 'amount-negative'}`}>
          {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
        </div>
        <span className={`badge badge-${tx.type}`}>{tx.type}</span>
      </div>
      <div className="tx-actions">
        <button className="tx-btn" onClick={() => onEdit(tx)} title="Edit">
          <RiEditLine />
        </button>
        <button className="tx-btn tx-btn-danger" onClick={() => onDelete(tx.id)} title="Delete">
          <RiDeleteBinLine />
        </button>
      </div>
    </div>
  );
}
