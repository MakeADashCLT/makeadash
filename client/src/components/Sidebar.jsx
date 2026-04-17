import { NavLink } from 'react-router-dom'
import './Sidebar.css'

// ─── Inline SVG icons (no extra dependency) ──────────────────────────────────

function IconDashboard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  )
}

function IconWorkboards() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="5" rx="1"/>
      <rect x="3" y="11" width="11" height="5" rx="1"/>
      <rect x="3" y="19" width="7" height="2" rx="1"/>
    </svg>
  )
}

function IconSettings() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  )
}

function IconCanvas() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  )
}

function IconSpotify() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 11.5c2.5-1 5.5-.8 7.5.5"/>
      <path d="M7 14.5c3-1.2 6.5-1 9 .7"/>
      <path d="M9 8.5c2.5-.8 6-.5 8 1"/>
    </svg>
  )
}

function IconDiscord() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.3 4.4A18.4 18.4 0 0 0 15.4 3a12.7 12.7 0 0 0-.6 1.2 17 17 0 0 0-5.1 0A12.7 12.7 0 0 0 9 3a18.4 18.4 0 0 0-4.9 1.4C1.7 8.4 1 12.3 1.3 16.2a18.5 18.5 0 0 0 5.6 2.8 13.9 13.9 0 0 0 1.2-2 12 12 0 0 1-1.9-.9l.5-.3a13.2 13.2 0 0 0 11.3 0l.5.3a12 12 0 0 1-1.9.9 13.9 13.9 0 0 0 1.2 2 18.5 18.5 0 0 0 5.6-2.8c.4-4.5-.7-8.4-3-11.8zM8.5 13.8c-1.1 0-2-.9-2-2.1s.9-2.1 2-2.1 2 1 2 2.1-.9 2.1-2 2.1zm7 0c-1.1 0-2-.9-2-2.1s.9-2.1 2-2.1 2 1 2 2.1-.9 2.1-2 2.1z"/>
    </svg>
  )
}

function IconPlus() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  )
}

function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-label="MakeADash logo mark">
      <rect width="32" height="32" rx="8" fill="#4f98a3"/>
      <path d="M9 10h6l3 12H9V10z" fill="white" opacity="0.9"/>
      <path d="M15 10h8v12h-5l-3-12z" fill="white" opacity="0.6"/>
    </svg>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PRIMARY_NAV = [
  { to: '/dashboard',  label: 'Dashboard',  Icon: IconDashboard  },
  { to: '/workboards', label: 'Workboards', Icon: IconWorkboards },
  { to: '/settings',   label: 'Settings',   Icon: IconSettings   },
]

const EXTERNAL_LINKS = [
  { href: 'https://canvas.instructure.com', label: 'Canvas',  Icon: IconCanvas  },
  { href: 'https://open.spotify.com',       label: 'Spotify', Icon: IconSpotify },
  { href: 'https://discord.com/app',        label: 'Discord', Icon: IconDiscord },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function Sidebar({ onAddWidget, onLogout }) {
  return ( 
    <aside className="sidebar" aria-label="Main navigation">

      {/* Logo */}
      <div className="sidebar-logo">
        <LogoMark />
        <div className="sidebar-logo-text">
          <span className="sidebar-logo-name">MakeADash</span>
          <span className="sidebar-logo-sub">THE DIGITAL DASHBOARD</span>
        </div>
      </div>

      {/* Primary nav */}
      <nav className="sidebar-nav" aria-label="Primary">
        {PRIMARY_NAV.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-nav-item${isActive ? ' sidebar-nav-item--active' : ''}`
            }
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Add Widget */}
      <button
        className="sidebar-add-widget"
        onClick={onAddWidget}
        aria-label="Add widget"
        type="button"
      >
        <IconPlus />
        <span>Add Widget</span>
      </button>

      <div className="sidebar-spacer" aria-hidden="true" />

      {/* External links */}
      <section className="sidebar-external" aria-label="External links">
        <span className="sidebar-section-label">EXTERNAL LINKS</span>
        {EXTERNAL_LINKS.map(({ href, label, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-external-item"
          >
            <Icon />
            <span>{label}</span>
          </a>
        ))}
      </section>

    </aside>
  )
}