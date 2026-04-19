import React from 'react';
import { CATEGORIES } from '../../utils/currencyFormatter';
import './Filters.css';

export default function Filters({
  filterCategory, setFilterCategory,
  filterType, setFilterType,
  filterDateFrom, setFilterDateFrom,
  filterDateTo, setFilterDateTo,
  sortBy, setSortBy,
  sortDir, setSortDir
}) {
  return (
    <div className="filters">
      <div className="filter-row">
        <div className="filter-group">
          <label className="form-label">Category</label>
          <select className="form-input" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label className="form-label">Type</label>
          <select className="form-input" value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="All">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="filter-group">
          <label className="form-label">Sort By</label>
          <select className="form-input" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="category">Category</option>
          </select>
        </div>
        <div className="filter-group">
          <label className="form-label">Order</label>
          <select className="form-input" value={sortDir} onChange={e => setSortDir(e.target.value)}>
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>
      <div className="filter-row">
        <div className="filter-group">
          <label className="form-label">From Date</label>
          <input type="date" className="form-input" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} />
        </div>
        <div className="filter-group">
          <label className="form-label">To Date</label>
          <input type="date" className="form-input" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} />
        </div>
        <div className="filter-group filter-reset">
          <label className="form-label">&nbsp;</label>
          <button className="btn btn-ghost" onClick={() => {
            setFilterCategory('All'); setFilterType('All');
            setFilterDateFrom(''); setFilterDateTo('');
            setSortBy('date'); setSortDir('desc');
          }}>Reset Filters</button>
        </div>
      </div>
    </div>
  );
}
