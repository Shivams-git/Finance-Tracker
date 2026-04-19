import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  RiDashboardFill, RiExchangeFill, RiAddCircleFill,
  RiPieChartFill, RiWallet3Fill
} from 'react-icons/ri'
import './Navbar.css'

const links = [
  { to: '/dashboard',        icon: <RiDashboardFill />, label: 'Dashboard'    },
  { to: '/transactions',     icon: <RiExchangeFill />,  label: 'Transactions' },
  { to: '/transactions/new', icon: <RiAddCircleFill />, label: 'Add New'      },
  { to: '/budget',           icon: <RiWallet3Fill />,   label: 'Budget'       },
  { to: '/analytics',        icon: <RiPieChartFill />,  label: 'Analytics'    },
]

export default function Navbar() {
  return (
    <aside className="navbar">
      <div className="navbar-brand">
        <div className="navbar-logo"><RiWallet3Fill /></div>
        <div className="navbar-name">Cash Flow</div>
      </div>
      <div className="navbar-divider" />
      <nav className="navbar-links">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{link.icon}</span>
            <span className="nav-label">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
