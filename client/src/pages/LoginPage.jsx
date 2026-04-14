import { useState } from 'react'
import './LoginPage.css'

/**
 * LoginPage
 * Props:  onLogin () => void  – called after any successful auth flow
 */

function LogoMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-label="Canvas Deck logo mark">
      <rect width="32" height="32" rx="8" fill="#4f98a3"/>
      <path d="M9 10h6l3 12H9V10z" fill="white" opacity="0.9"/>
      <path d="M15 10h8v12h-5l-3-12z" fill="white" opacity="0.6"/>
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function CanvasIcon() {
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

function EyeIcon({ visible }) {
  return visible ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="#4f98a3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
    </svg>
  )
}

const AVATAR_COLORS = ['#4f98a3', '#6366f1', '#ec4899', '#f59e0b']
function AvatarStack() {
  return (
    <div className="lp-avatar-stack" aria-label="2,000+ members joined the workspace">
      {AVATAR_COLORS.map((c, i) => (
        <span key={i} className="lp-avatar" style={{ background: c, zIndex: 4 - i }}>
          {['A','B','C','D'][i]}
        </span>
      ))}
      <span className="lp-avatar lp-avatar--count">+2K</span>
      <span className="lp-avatar-label">JOINED THE WORKSPACE</span>
    </div>
  )
}

export default function LoginPage({ onLogin }) {
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [showPassword, setShowPass] = useState(false)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')

  const handleOAuth = (provider) => {
    setLoading(true)
    setError('')
    // TODO: redirect to real OAuth endpoint — /auth/canvas or /auth/google
    setTimeout(() => { setLoading(false); onLogin() }, 800)
  }

  const handleEmailLogin = (e) => {
    e.preventDefault()
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    setError('')
    // TODO: POST /api/auth/login  { email, password }
    setTimeout(() => { setLoading(false); onLogin() }, 800)
  }

  return (
    <div className="lp-root">
      {/* Left: Branding */}
      <div className="lp-left" aria-label="Canvas Deck branding">
        <div className="lp-left-inner">
          <div className="lp-brand">
            <LogoMark />
            <span className="lp-brand-name">Canvas Deck</span>
          </div>
          <h1 className="lp-headline">
            The Digital <span className="lp-headline-accent">Atelier.</span>
          </h1>
          <p className="lp-tagline">
            Consolidate your daily workspace and<br/>planning into one page.
          </p>
          <div className="lp-feature-card">
            <SparkleIcon />
            <p>Control what you want to see, such as your emails, assignments, announcements, and more.</p>
          </div>
          <AvatarStack />
        </div>
      </div>

      {/* Right: Auth card */}
      <div className="lp-right" aria-label="Sign in form">
        <div className="lp-card">
          <div className="lp-card-header">
            <h2>Welcome Back</h2>
            <p>Step into your curated environment.</p>
          </div>

          <div className="lp-oauth">
            <button className="lp-btn lp-btn--canvas"
                    onClick={() => handleOAuth('canvas')} disabled={loading}>
              <CanvasIcon /> Connect with Canvas
            </button>
            <button className="lp-btn lp-btn--google"
                    onClick={() => handleOAuth('google')} disabled={loading}>
              <GoogleIcon /> Continue with Google
            </button>
          </div>

          <div className="lp-divider" role="separator">
            <span>OR EMAIL LOGIN</span>
          </div>

          <form className="lp-form" onSubmit={handleEmailLogin} noValidate>
            <div className="lp-field">
              <label htmlFor="lp-email">EMAIL ADDRESS</label>
              <input id="lp-email" type="email" placeholder="atelier@canvasdeck.io"
                     value={email} onChange={e => setEmail(e.target.value)}
                     autoComplete="email" disabled={loading} />
            </div>

            <div className="lp-field">
              <div className="lp-field-header">
                <label htmlFor="lp-password">PASSWORD</label>
                <button type="button" className="lp-forgot">FORGOT?</button>
              </div>
              <div className="lp-password-wrapper">
                <input id="lp-password" type={showPassword ? 'text' : 'password'}
                       placeholder="••••••••" value={password}
                       onChange={e => setPassword(e.target.value)}
                       autoComplete="current-password" disabled={loading} />
                <button type="button" className="lp-eye"
                        onClick={() => setShowPass(v => !v)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
            </div>

            {error && <p className="lp-error" role="alert">{error}</p>}

            <button type="submit" className="lp-btn lp-btn--signin" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="lp-signup-prompt">
            New to the atelier?{' '}
            <button type="button" className="lp-link">Create an account</button>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="lp-footer">
        <a href="#" className="lp-footer-link">PRIVACY</a>
        <span className="lp-footer-dot" aria-hidden="true">•</span>
        <a href="#" className="lp-footer-link">TERMS</a>
        <span className="lp-footer-dot" aria-hidden="true">•</span>
        <span className="lp-footer-version">V2.4.0</span>
      </footer>
    </div>
  )
}