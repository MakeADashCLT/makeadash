import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import './DashboardPage.css'

// ─── SVG Icons ───────────────────────────────────────────────────────────────

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
  GradCap: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
  MoreH: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>
    </svg>
  ),
  SkipBack: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/>
    </svg>
  ),
  SkipFwd: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/>
    </svg>
  ),
  Pause: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="4" width="4" height="16" rx="1"/>
      <rect x="14" y="4" width="4" height="16" rx="1"/>
    </svg>
  ),
  Play: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
  Shuffle: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/>
      <polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/>
    </svg>
  ),
  Repeat: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="17 1 21 5 17 9"/>
      <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
      <polyline points="7 23 3 19 7 15"/>
      <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    </svg>
  ),
  Mail: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  Discord: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.3 4.4A18.4 18.4 0 0 0 15.4 3a12.7 12.7 0 0 0-.6 1.2 17 17 0 0 0-5.1 0A12.7 12.7 0 0 0 9 3a18.4 18.4 0 0 0-4.9 1.4C1.7 8.4 1 12.3 1.3 16.2a18.5 18.5 0 0 0 5.6 2.8 13.9 13.9 0 0 0 1.2-2 12 12 0 0 1-1.9-.9l.5-.3a13.2 13.2 0 0 0 11.3 0l.5.3a12 12 0 0 1-1.9.9 13.9 13.9 0 0 0 1.2 2 18.5 18.5 0 0 0 5.6-2.8c.4-4.5-.7-8.4-3-11.8z"/>
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Emoji: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
      <line x1="9" y1="9" x2="9.01" y2="9"/>
      <line x1="15" y1="9" x2="15.01" y2="9"/>
    </svg>
  ),
  NowPlaying: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f98a3"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
      <line x1="12" y1="2" x2="12" y2="5"/>
    </svg>
  ),
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const ASSIGNMENTS = [
  { id: 1, title: 'Digital Typography Final', course: 'Advanced Design Studio', time: '11:59 PM', tag: 'TODAY',  urgent: true  },
  { id: 2, title: 'Research Methodology',     course: 'Cognitive Science',       time: '5:00 PM',  tag: 'FRI',   urgent: false },
  { id: 3, title: 'Interface Prototyping',    course: 'UX Design III',           time: '11:59 PM', tag: 'OCT 14', urgent: false },
]

const GRADES = [
  { id: 1, grade: 'A',  title: 'Case Study 02',    course: 'UX Foundations • Gradon, L.', score: '98/100' },
  { id: 2, grade: 'A-', title: 'Color Theory Quiz', course: 'Visual Arts • Miller, J.',    score: '92/100' },
  { id: 3, grade: 'A+', title: 'Weekly Journal',    course: 'Humanities 101 • Smith, R.',  score: '10/10'  },
]

const EMAILS = [
  { id: 1, initials: 'DL', bg: '#4a4947', sender: 'Design Team Lead', subject: 'Re: Feedback on Project Atelier', preview: "The latest mocks look promising, Alex. Let's discuss...", time: '2m ago' },
  { id: 2, initials: 'D',  bg: '#ea4c89', sender: 'Dribbble',          subject: 'Trending shots for you',          preview: 'Take a look at these daily inspirations based on...',  time: '1h ago' },
  { id: 3, initials: 'SC', bg: '#6366f1', sender: 'Sarah Connor',      subject: 'Weekend Plans?',                  preview: "Hey! Just checking if you're still down for that...",  time: '3h ago' },
]

const DISCORD_MESSAGES = [
  { id: 1, user: 'Marcus_V', time: '12:45 PM', bot: false, color: '#4f98a3',
    text: 'Yo @Alex, did you see the new Figma update? The multi-edit tool is absolutely insane.' },
  { id: 2, user: 'Mojo-Bot',  time: '12:48 PM', bot: true,  color: '#4ccec0',
    text: null, code: 'deck-core-v2',
    prefix: 'A new repository was pushed to ', suffix: '. Check changelog for details.' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function GradeBadge({ grade }) {
  const colors = { 'A+': '#4ccec0', 'A': '#4f98a3', 'A-': '#6ba3aa', 'B+': '#6366f1' }
  return (
    <span className="dp-grade-badge" style={{ background: colors[grade] || '#4a4947' }}>
      {grade}
    </span>
  )
}

function Avatar({ initials, bg, size = 36 }) {
  return (
    <span className="dp-avatar" style={{ background: bg, width: size, height: size, fontSize: size * 0.33 }}>
      {initials}
    </span>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function DashboardPage({ onLogout }) {
  const [chatMsg, setChatMsg]   = useState('')
  const [isPlaying, setPlaying] = useState(true)
  const [progress]              = useState(42)

  return (
    <div className="dp-root">
      <Sidebar onLogout={onLogout} />

      <div className="dp-main">
        {/* Top bar */}
        <header className="dp-topbar">
          <div className="dp-search">
            <Icon.Search />
            <input type="search" placeholder="Search Workspace…" aria-label="Search workspace" />
          </div>
          <div className="dp-topbar-right">
            <button className="dp-icon-btn" aria-label="Notifications">
              <Icon.Bell />
              <span className="dp-notif-dot" aria-hidden="true" />
            </button>
            <button className="dp-icon-btn" aria-label="App grid"><Icon.Grid /></button>
            <div className="dp-user">
              <div className="dp-user-info">
                <span className="dp-user-name">Alex Sterling</span>
                <span className="dp-user-badge">PREMIUM ATELIER</span>
              </div>
              <Avatar initials="AS" bg="#4f98a3" size={34} />
            </div>
          </div>
        </header>

        <div className="dp-content">
          {/* Title + KPIs */}
          <div className="dp-title-row">
            <div>
              <h1 className="dp-page-title">Main Deck</h1>
              <p className="dp-page-sub">Welcome back, Alex. Your creative flow is looking optimal today.</p>
            </div>
            <div className="dp-kpis">
              <div className="dp-kpi">
                <span className="dp-kpi-label">EFFICIENCY</span>
                <span className="dp-kpi-value dp-kpi-value--teal">94%</span>
              </div>
              <div className="dp-kpi">
                <span className="dp-kpi-label">TASKS DONE</span>
                <span className="dp-kpi-value">12</span>
              </div>
            </div>
          </div>

          {/* Row 1 */}
          <div className="dp-row dp-row--top">
            {/* Canvas Workspace */}
            <section className="dp-widget" aria-label="Canvas Workspace">
              <div className="dp-widget-header">
                <div className="dp-widget-title"><Icon.GradCap /><span>CANVAS WORKSPACE</span></div>
                <span className="dp-overdue-badge">3 OVERDUE</span>
              </div>
              <div className="dp-canvas-body">
                <div className="dp-canvas-col">
                  <p className="dp-col-label">UPCOMING ASSIGNMENTS</p>
                  <ul className="dp-assignment-list">
                    {ASSIGNMENTS.map(a => (
                      <li key={a.id} className="dp-assignment">
                        <span className={`dp-assignment-bar${a.urgent ? ' dp-assignment-bar--urgent' : ''}`} />
                        <div className="dp-assignment-body">
                          <div className="dp-assignment-top">
                            <span className="dp-assignment-title">{a.title}</span>
                            <span className={`dp-assignment-tag${a.urgent ? ' dp-assignment-tag--today' : ''}`}>{a.tag}</span>
                          </div>
                          <span className="dp-assignment-meta">{a.course} • {a.time}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="dp-canvas-col">
                  <p className="dp-col-label">RECENT GRADES</p>
                  <ul className="dp-grade-list">
                    {GRADES.map(g => (
                      <li key={g.id} className="dp-grade-item">
                        <GradeBadge grade={g.grade} />
                        <div className="dp-grade-body">
                          <span className="dp-grade-title">{g.title}</span>
                          <span className="dp-grade-meta">{g.course}</span>
                        </div>
                        <span className="dp-grade-score">{g.score}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Spotify */}
            <section className="dp-widget dp-widget--spotify" aria-label="Now Playing">
              <div className="dp-widget-header">
                <div className="dp-widget-title"><Icon.NowPlaying /><span>NOW PLAYING</span></div>
                <button className="dp-icon-btn" aria-label="More options"><Icon.MoreH /></button>
              </div>
              <div className="dp-album-art">
                <div className="dp-album-img">
                  <svg viewBox="0 0 200 160" width="100%" height="100%" aria-hidden="true">
                    <defs>
                      <radialGradient id="catBg" cx="50%" cy="40%" r="60%">
                        <stop offset="0%" stopColor="#3d2b10"/>
                        <stop offset="100%" stopColor="#111"/>
                      </radialGradient>
                    </defs>
                    <rect width="200" height="160" fill="url(#catBg)"/>
                    <ellipse cx="100" cy="95" rx="42" ry="38" fill="#c47a28" opacity="0.85"/>
                    <ellipse cx="100" cy="80" rx="32" ry="28" fill="#d4892f" opacity="0.9"/>
                    <polygon points="74,58 82,38 90,58" fill="#c47a28"/>
                    <polygon points="110,58 118,38 126,58" fill="#c47a28"/>
                    <ellipse cx="90" cy="78" rx="7" ry="9" fill="#1a0f00"/>
                    <ellipse cx="110" cy="78" rx="7" ry="9" fill="#1a0f00"/>
                    <ellipse cx="90" cy="78" rx="3" ry="5" fill="#f5c842"/>
                    <ellipse cx="110" cy="78" rx="3" ry="5" fill="#f5c842"/>
                    <ellipse cx="100" cy="88" rx="5" ry="3" fill="#d4892f"/>
                    <line x1="78" y1="90" x2="58" y2="87" stroke="#7a4a10" strokeWidth="1.2"/>
                    <line x1="78" y1="93" x2="58" y2="93" stroke="#7a4a10" strokeWidth="1.2"/>
                    <line x1="122" y1="90" x2="142" y2="87" stroke="#7a4a10" strokeWidth="1.2"/>
                    <line x1="122" y1="93" x2="142" y2="93" stroke="#7a4a10" strokeWidth="1.2"/>
                    <rect x="148" y="112" width="38" height="38" rx="10" fill="#4f98a3"/>
                    <g stroke="white" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="157" y1="131" x2="157" y2="131"/>
                      <line x1="162" y1="125" x2="162" y2="137"/>
                      <line x1="167" y1="121" x2="167" y2="141"/>
                      <line x1="172" y1="125" x2="172" y2="137"/>
                      <line x1="177" y1="131" x2="177" y2="131"/>
                    </g>
                  </svg>
                </div>
              </div>
              <div className="dp-track-info">
                <p className="dp-track-title">Midnight City Vibes</p>
                <p className="dp-track-artist">Lofi Girl • Chill Study Beats</p>
              </div>
              <div className="dp-progress-wrapper">
                <div className="dp-progress-bar">
                  <div className="dp-progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <div className="dp-controls">
                <button className="dp-ctrl-btn" aria-label="Shuffle"><Icon.Shuffle /></button>
                <button className="dp-ctrl-btn" aria-label="Previous"><Icon.SkipBack /></button>
                <button className="dp-ctrl-btn dp-ctrl-btn--primary"
                        onClick={() => setPlaying(p => !p)}
                        aria-label={isPlaying ? 'Pause' : 'Play'}>
                  {isPlaying ? <Icon.Pause /> : <Icon.Play />}
                </button>
                <button className="dp-ctrl-btn" aria-label="Next"><Icon.SkipFwd /></button>
                <button className="dp-ctrl-btn" aria-label="Repeat"><Icon.Repeat /></button>
              </div>
            </section>
          </div>

          {/* Row 2 */}
          <div className="dp-row dp-row--bottom">
            {/* Gmail */}
            <section className="dp-widget" aria-label="Gmail Inbox">
              <div className="dp-widget-header">
                <div className="dp-widget-title"><Icon.Mail /><span>GMAIL INBOX</span></div>
                <button className="dp-view-all-btn">VIEW ALL</button>
              </div>
              <ul className="dp-email-list">
                {EMAILS.map(e => (
                  <li key={e.id} className="dp-email-item">
                    <Avatar initials={e.initials} bg={e.bg} size={38} />
                    <div className="dp-email-body">
                      <div className="dp-email-top">
                        <span className="dp-email-sender">{e.sender}</span>
                        <span className="dp-email-time">{e.time}</span>
                      </div>
                      <span className="dp-email-subject">{e.subject}</span>
                      <span className="dp-email-preview">{e.preview}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Discord */}
            <section className="dp-widget dp-widget--discord" aria-label="Discord - The Creative Den">
              <div className="dp-widget-header">
                <div className="dp-widget-title">
                  <Icon.Discord />
                  <div>
                    <div>THE CREATIVE DEN</div>
                    <span className="dp-discord-channel">#design-critique</span>
                  </div>
                </div>
                <div className="dp-discord-avatars">
                  {['#4f98a3','#ec4899','#f59e0b'].map((c,i) => (
                    <span key={i} className="dp-dc-avatar" style={{ background: c, marginLeft: i > 0 ? -6 : 0 }}>
                      {['M','S','K'][i]}
                    </span>
                  ))}
                  <span className="dp-dc-count">+12</span>
                </div>
              </div>
              <div className="dp-messages">
                {DISCORD_MESSAGES.map(m => (
                  <div key={m.id} className="dp-message">
                    <span className="dp-msg-avatar" style={{ background: m.color }}>{m.user[0]}</span>
                    <div className="dp-msg-body">
                      <div className="dp-msg-header">
                        <span className="dp-msg-user" style={{ color: m.color }}>{m.user}</span>
                        {m.bot && <span className="dp-bot-badge">BOT</span>}
                        <span className="dp-msg-time">{m.time}</span>
                      </div>
                      <p className="dp-msg-text">
                        {m.text || <>
                          {m.prefix}
                          <code className="dp-code">{m.code}</code>
                          {m.suffix}
                        </>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <form className="dp-chat-input" onSubmit={e => { e.preventDefault(); setChatMsg('') }}>
                <button type="button" className="dp-icon-btn" aria-label="Attach"><Icon.Plus /></button>
                <input type="text" placeholder="Message #design-critique"
                       value={chatMsg} onChange={e => setChatMsg(e.target.value)}
                       aria-label="Type a message" />
                <button type="button" className="dp-icon-btn" aria-label="Emoji"><Icon.Emoji /></button>
              </form>
            </section>
          </div>

        </div>
      </div>
    </div>
  )
}