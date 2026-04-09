import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import './WorkboardsPage.css'

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Bell: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Grid: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  DotsH: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>
    </svg>
  ),
  Paperclip: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
    </svg>
  ),
  Share: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  ),
  Bolt: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Plus: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Trend: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4ccec0"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
      <polyline points="16 7 22 7 22 13"/>
    </svg>
  ),
}

// ─── Kanban data ──────────────────────────────────────────────────────────────

const COLUMNS = [
  {
    id: 'todo', label: 'TO DO', count: 4, dotColor: '#4a4947',
    cards: [
      {
        id: 't1', category: 'UI DESIGN', categoryColor: 'default',
        title: 'Finalize Tonal Palettes for High-Contrast Mode',
        description: 'Implement the ghost-border rules and ensure WCAG 2.1 compliance f…',
        attachments: 3, progress: null, tags: [], done: false, activeIndicator: false,
        assignee: { initials: 'LD', label: 'LEAD DESIGNER', bg: '#4a4947', multi: false },
        due: '2d', dueUrgent: true,
      },
      {
        id: 't2', category: 'DEVELOPMENT', categoryColor: 'teal',
        title: 'Setup Tailwind v4 Alpha Workspace',
        description: null, attachments: null, progress: null,
        tags: ['TICKET-442', 'URGENT'], done: false, activeIndicator: false,
        assignee: { initials: 'LD', label: 'LEAD DEV', bg: '#4a4947', multi: false },
        due: null, dueUrgent: false,
      },
    ],
  },
  {
    id: 'inprogress', label: 'IN PROGRESS', count: 2, dotColor: '#4ccec0',
    cards: [
      {
        id: 'p1', category: 'REFACTOR', categoryColor: 'default',
        title: 'Modularize Glassmorphism Components',
        description: null, attachments: null, progress: 65,
        tags: [], done: false, activeIndicator: true,
        assignee: { initials: 'DV', label: 'DEVELOPERS', bg: '#4f98a3', multi: true },
        due: null, dueUrgent: false,
      },
      {
        id: 'p2', category: 'DESIGN OPS', categoryColor: 'default',
        title: 'Asset Migration to CDN',
        description: 'Optimizing all dashboard textures and glass backgrounds for performance.',
        attachments: null, progress: null, tags: [], done: false, activeIndicator: false,
        assignee: { initials: 'SA', label: 'SYSTEM ARCHITECT', bg: '#4a4947', multi: false },
        due: null, dueUrgent: false,
      },
    ],
  },
  {
    id: 'done', label: 'DONE', count: 12, dotColor: '#3a3937',
    cards: [
      {
        id: 'd1', category: 'STRATEGY', categoryColor: 'default',
        title: 'Define Digital Atelier Concept',
        description: null, attachments: null, progress: null,
        tags: [], done: true, activeIndicator: false,
        assignee: { initials: 'CD', label: 'CREATIVE DIR.', bg: '#4a4947', multi: false },
        due: 'SEP 12', dueUrgent: false,
      },
      {
        id: 'd2', category: 'UI DESIGN', categoryColor: 'default',
        title: 'Main Sidebar Navigation Component',
        description: null, attachments: null, progress: null,
        tags: [], done: true, activeIndicator: false,
        assignee: { initials: 'LD', label: 'LEAD DESIGNER', bg: '#4a4947', multi: false },
        due: null, dueUrgent: false,
      },
    ],
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function CategoryBadge({ label, color }) {
  const styles = {
    teal:    { background: 'rgba(76,206,192,0.12)', color: '#4ccec0' },
    default: { background: 'rgba(255,255,255,0.06)', color: '#797876' },
  }
  return <span className="wb-badge" style={styles[color] || styles.default}>{label}</span>
}

function Avatar({ initials, bg, size = 26 }) {
  return (
    <span className="wb-avatar" style={{ background: bg, width: size, height: size, fontSize: size * 0.34 }}>
      {initials}
    </span>
  )
}

function TaskCard({ card }) {
  return (
    <div className={`wb-card${card.done ? ' wb-card--done' : ''}`}>
      <div className="wb-card-header">
        <CategoryBadge label={card.category} color={card.categoryColor} />
        <div className="wb-card-header-right">
          {card.attachments && (
            <span className="wb-attach"><Icon.Paperclip /> {card.attachments}</span>
          )}
          {card.activeIndicator && (
            <span className="wb-active-dot" aria-label="Active">
              <svg width="18" height="18" viewBox="0 0 18 18">
                <circle cx="9" cy="9" r="8" fill="rgba(76,206,192,0.12)" stroke="rgba(76,206,192,0.3)" strokeWidth="1"/>
                <circle cx="9" cy="9" r="4" fill="#4ccec0"/>
              </svg>
            </span>
          )}
          {card.done && (
            <span className="wb-done-check" aria-label="Completed">
              <svg width="18" height="18" viewBox="0 0 18 18">
                <circle cx="9" cy="9" r="8" fill="rgba(79,152,163,0.15)" stroke="rgba(79,152,163,0.3)" strokeWidth="1"/>
                <polyline points="5,9 8,12 13,6" fill="none" stroke="#4f98a3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          )}
        </div>
      </div>

      <h3 className={`wb-card-title${card.done ? ' wb-card-title--muted' : ''}`}>{card.title}</h3>

      {card.description && <p className="wb-card-desc">{card.description}</p>}

      {card.progress !== null && card.progress !== undefined && (
        <div className="wb-progress">
          <div className="wb-progress-bar">
            <div className="wb-progress-fill" style={{ width: `${card.progress}%` }} />
          </div>
        </div>
      )}

      {card.tags.length > 0 && (
        <div className="wb-tags">
          {card.tags.map(t => (
            <span key={t} className={`wb-tag${t === 'URGENT' ? ' wb-tag--urgent' : ''}`}>{t}</span>
          ))}
        </div>
      )}

      <div className="wb-card-footer">
        <div className="wb-assignee">
          {card.assignee.multi ? (
            <div className="wb-multi-avatar">
              <Avatar initials="DV" bg="#4f98a3" size={22} />
              <Avatar initials="MK" bg="#6366f1" size={22} />
            </div>
          ) : (
            <Avatar initials={card.assignee.initials} bg={card.assignee.bg} size={22} />
          )}
          <span className="wb-assignee-label">{card.assignee.label}</span>
        </div>
        {card.due && (
          <span className={`wb-due${card.dueUrgent ? ' wb-due--urgent' : ''}`}>
            {card.dueUrgent && <span className="wb-due-dot" />}
            {card.due}
          </span>
        )}
        {card.progress !== null && card.progress !== undefined && (
          <span className="wb-progress-pct">{card.progress}%</span>
        )}
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function WorkboardsPage({ onLogout }) {
  const [search, setSearch] = useState('')

  return (
    <div className="wb-root">
      <Sidebar onLogout={onLogout} />
      <div className="wb-main">
        <header className="wb-topbar">
          <div className="wb-search">
            <Icon.Search />
            <input type="search" placeholder="Search workboards…"
                   value={search} onChange={e => setSearch(e.target.value)}
                   aria-label="Search workboards" />
          </div>
          <div className="wb-topbar-right">
            <button className="wb-icon-btn" aria-label="Notifications">
              <Icon.Bell /><span className="wb-notif-dot" />
            </button>
            <button className="wb-icon-btn" aria-label="App grid"><Icon.Grid /></button>
            <button className="wb-btn-add-task"><Icon.Bolt /> Add Task</button>
            <button className="wb-user-avatar" aria-label="User menu">
              <span style={{ background: '#4f98a3', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white' }}>AS</span>
            </button>
          </div>
        </header>

        <div className="wb-content">
          {/* Project header */}
          <div className="wb-project-header">
            <div className="wb-project-meta">
              <div className="wb-active-label">
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                  <rect width="5" height="5" rx="1" fill="#4ccec0"/>
                  <rect x="7" width="5" height="5" rx="1" fill="#4ccec0" opacity="0.6"/>
                  <rect y="7" width="5" height="5" rx="1" fill="#4ccec0" opacity="0.6"/>
                  <rect x="7" y="7" width="5" height="5" rx="1" fill="#4ccec0" opacity="0.3"/>
                </svg>
                <span>ACTIVE WORKSPACE</span>
              </div>
              <h1 className="wb-project-title">
                Project Workboard: <span className="wb-project-name">Stellar UI Core</span>
              </h1>
              <p className="wb-project-desc">
                Managing design tokens, atomic components, and dark-mode heuristics for the upcoming Q4 release cycle.
              </p>
            </div>
            <div className="wb-project-actions">
              <div className="wb-team-avatars">
                {['#4f98a3','#6366f1','#ec4899','#f59e0b'].map((c,i) => (
                  <span key={i} className="wb-team-avatar" style={{ background: c, marginLeft: i > 0 ? -8 : 0, zIndex: 4 - i }}>
                    {['A','B','C','D'][i]}
                  </span>
                ))}
                <span className="wb-team-more">+8</span>
              </div>
              <button className="wb-btn-share"><Icon.Share /> Share</button>
              <button className="wb-btn-create"><Icon.Bolt /> Create<br/>Task</button>
            </div>
          </div>

          {/* Kanban */}
          <div className="wb-board">
            {COLUMNS.map(col => (
              <div key={col.id} className="wb-column">
                <div className="wb-col-header">
                  <div className="wb-col-label">
                    <span className="wb-col-dot" style={{ background: col.dotColor }} />
                    <span className="wb-col-name">{col.label}</span>
                    <span className="wb-col-count">{col.count}</span>
                  </div>
                  <button className="wb-icon-btn" aria-label={`${col.label} options`}><Icon.DotsH /></button>
                </div>
                <div className="wb-cards">
                  {col.cards.map(card => <TaskCard key={card.id} card={card} />)}
                </div>
                {col.id === 'todo' && (
                  <button className="wb-new-task"><Icon.Plus /> New Task</button>
                )}
                {col.id === 'done' && (
                  <div className="wb-velocity">
                    <div className="wb-velocity-header">
                      <span className="wb-velocity-label">TEAM VELOCITY</span>
                      <Icon.Trend />
                    </div>
                    <div className="wb-velocity-value">
                      <span className="wb-velocity-num">24</span>
                      <span className="wb-velocity-unit">tasks / week</span>
                    </div>
                    <div className="wb-velocity-bars">
                      <div className="wb-vel-bar wb-vel-bar--todo" style={{ width: '32%' }} />
                      <div className="wb-vel-bar wb-vel-bar--prog" style={{ width: '28%' }} />
                      <div className="wb-vel-bar wb-vel-bar--done" style={{ width: '20%' }} />
                    </div>
                    <div className="wb-velocity-legend">
                      <span><span className="wb-leg-dot" style={{ background: '#6366f1' }} />TODO</span>
                      <span><span className="wb-leg-dot" style={{ background: '#4ccec0' }} />PROG</span>
                      <span><span className="wb-leg-dot" style={{ background: '#3a3937' }} />DONE</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}