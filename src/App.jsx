import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FinanceProvider } from './context/FinanceContext'
import Navbar from './components/Navbar/Navbar'
import Dashboard from './pages/Dashboard/Dashboard'
import Transactions from './pages/Transactions/Transactions'
import AddTransaction from './pages/AddTransaction/AddTransaction'
import Budget from './pages/Budget/Budget'
import Analytics from './pages/Analytics/Analytics'

export default function App() {
  return (
    <FinanceProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/transactions/new" element={<AddTransaction />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </main>
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={2500}
          theme="dark"
          toastStyle={{
            background: 'var(--card2)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
          }}
        />
      </BrowserRouter>
    </FinanceProvider>
  )
}
