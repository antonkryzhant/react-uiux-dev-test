import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Home, BarChart3, Users, Settings, HelpCircle, ShoppingBag, CreditCard, Menu, X } from 'lucide-react'
import clsx from 'clsx'
import './styles/tailwind.css'
import './styles/global.scss'
import './styles/broken-layout.css'
import Dashboard from './pages/Dashboard.jsx'
import Projects from './pages/Projects.jsx'
import Team from './pages/Team.jsx'
import Reports from './pages/Reports.jsx'
import Billing from './pages/Billing.jsx'
import SettingsPage from './pages/Settings.jsx'
import Support from './pages/Support.jsx'

const routes = [
  { path: '/', label: 'Dashboard', icon: Home, component: Dashboard },
  { path: '/projects', label: 'Projects', icon: ShoppingBag, component: Projects },
  { path: '/team', label: 'Team', icon: Users, component: Team },
  { path: '/reports', label: 'Reports', icon: BarChart3, component: Reports },
  // FIX: was using ShoppingBag (same as Projects) — now CreditCard for Billing
  { path: '/billing', label: 'Billing', icon: CreditCard, component: Billing },
  { path: '/settings', label: 'Settings', icon: Settings, component: SettingsPage },
  { path: '/support', label: 'Support', icon: HelpCircle, component: Support }
]

function readHashPath() {
  // FIX: strip query strings from hash so "#/team?tab=active" resolves to "/team"
  const hash = window.location.hash.replace('#', '') || '/'
  return hash.split('?')[0]
}

function App() {
  const [path, setPath] = useState(readHashPath())
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
  const [globalSearch, setGlobalSearch] = useState('')

  useEffect(() => {
    const onHashChange = () => setPath(readHashPath())
    window.addEventListener('hashchange', onHashChange)
    // FIX: was `() => onHashChange()` (a new lambda each render) which never matched
    // the registered listener, so the listener was never removed — causing duplicates
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    document.body.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  const currentRoute = useMemo(() => {
    return routes.find((route) => route.path === path) || routes[0]
  }, [path])

  const Page = currentRoute.component

  return (
    <div className="app-shell">
      <aside className={clsx('sidebar', sidebarOpen && 'sidebar--open')}>
        <div className="brand-block">
          <div className="brand-logo" aria-hidden="true">N</div>
          <div>
            <strong>Northstar</strong>
            <span>Ops Console</span>
          </div>
          <button className="icon-only close-mobile" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>
        <nav className="nav-list" aria-label="Main navigation">
          {routes.map((route) => {
            const Icon = route.icon
            return (
              <a
                key={route.path}
                className={clsx('nav-item', path === route.path && 'active')}
                href={`#${route.path}`}
                aria-current={path === route.path ? 'page' : undefined}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{route.label}</span>
              </a>
            )
          })}
        </nav>
        <div className="sidebar-footer">
          <p>Northstar</p>
          <small>Operations Console v1.0</small>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="icon-only menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Open menu">
            <Menu size={20} />
          </button>
          <div className="search-box">
            <label htmlFor="global-search" className="sr-only">Search</label>
            <input
              id="global-search"
              value={globalSearch}
              onChange={(event) => setGlobalSearch(event.target.value)}
              placeholder="Search everything..."
            />
          </div>
          <button className="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? 'Light' : 'Dark'} mode
          </button>
        </header>
        <section className="page-frame">
          <Page search={globalSearch} />
        </section>
      </main>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
