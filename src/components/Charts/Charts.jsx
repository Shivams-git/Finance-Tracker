import React from 'react'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar
} from 'recharts'
import { CATEGORY_COLORS, formatCurrency } from '../../utils/currencyFormatter'

const TIP = {
  backgroundColor: '#282828',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  color: '#fff',
  fontFamily: "'Inter', sans-serif",
  fontSize: '0.8rem',
  boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
}

const AXIS = { fill: '#6a6a6a', fontSize: 11, fontFamily: "'Inter', sans-serif" }
const GRID = { strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.05)' }

export function SpendingPieChart({ data }) {
  if (!data || data.length === 0)
    return <div style={{ height: 240, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text3)', fontSize:'0.85rem' }}>No data yet</div>

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={105}
          paddingAngle={2}
          dataKey="value"
          strokeWidth={0}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={CATEGORY_COLORS[entry.name] || '#6a6a6a'} />
          ))}
        </Pie>
        <Tooltip contentStyle={TIP} formatter={(val) => [formatCurrency(val), 'Amount']} />
        <Legend
          iconType="circle"
          iconSize={7}
          wrapperStyle={{ fontSize: '0.75rem', color: '#b3b3b3', paddingTop: 8 }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function MonthlyTrendChart({ data }) {
  if (!data || data.length === 0)
    return <div style={{ height: 240, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text3)', fontSize:'0.85rem' }}>No data yet</div>

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid {...GRID} />
        <XAxis dataKey="month" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
        <Tooltip contentStyle={TIP} formatter={(val) => formatCurrency(val)} />
        <Legend wrapperStyle={{ fontSize: '0.75rem', color: '#b3b3b3' }} />
        <Line type="monotone" dataKey="income"   stroke="#1db954" strokeWidth={2} dot={false} name="Income" activeDot={{ r: 4, fill: '#1db954' }} />
        <Line type="monotone" dataKey="expenses" stroke="#e05c5c" strokeWidth={2} dot={false} name="Expenses" activeDot={{ r: 4, fill: '#e05c5c' }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function IncomeExpenseBar({ data }) {
  if (!data || data.length === 0)
    return <div style={{ height: 240, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text3)', fontSize:'0.85rem' }}>No data yet</div>

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }} barCategoryGap="35%">
        <CartesianGrid {...GRID} />
        <XAxis dataKey="month" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
        <Tooltip contentStyle={TIP} formatter={(val) => formatCurrency(val)} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        <Legend wrapperStyle={{ fontSize: '0.75rem', color: '#b3b3b3' }} />
        <Bar dataKey="income"   fill="#1db954" name="Income"   radius={[4,4,0,0]} />
        <Bar dataKey="expenses" fill="#e05c5c" name="Expenses" radius={[4,4,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
