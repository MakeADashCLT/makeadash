import './SettingsPage.css'
import Sidebar from '../components/Sidebar'

export default function SettingsPage({ user, onLogout }) {
  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      })
    : '—'

  const provider = user?.app_metadata?.provider ?? 'email'

  return (
    <div className="dashboard-shell">
      <Sidebar user={user} onLogout={onLogout} onAddWidget={() => {}} />
      <main className="settings-main">
        <div className="settings-topbar">
          <p className="settings-kicker">ACCOUNT</p>
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">Your profile and account details.</p>
        </div>

        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-avatar">
              {user?.email?.slice(0, 2).toUpperCase() ?? '??'}
            </div>
            <div>
              <p className="settings-card-title">{user?.email ?? 'Loading...'}</p>
              <p className="settings-card-sub">
                Signed in via <span className="settings-badge">{provider}</span>
              </p>
            </div>
          </div>

          <div className="settings-fields">
            <div className="settings-field">
              <span className="settings-field-label">Email address</span>
              <span className="settings-field-value">{user?.email ?? '—'}</span>
            </div>
            <div className="settings-field">
              <span className="settings-field-label">Member since</span>
              <span className="settings-field-value">{joinedDate}</span>
            </div>
            <div className="settings-field">
              <span className="settings-field-label">User ID</span>
              <span className="settings-field-value settings-field-value--mono">
                {user?.id ?? '—'}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}