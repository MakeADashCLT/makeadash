import { useState } from 'react'
import './LoginPage.css' // reuse same styles
import { supabase } from '../supabaseClient'

function LogoMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#4f98a3"/>
      <path d="M9 10h6l3 12H9V10z" fill="white" opacity="0.9"/>
      <path d="M15 10h8v12h-5l-3-12z" fill="white" opacity="0.6"/>
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="#4f98a3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
    </svg>
  )
}

export default function SignupPage({ onSignup }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async (e) => {
    e.preventDefault()

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    onSignup(data.user)
  }

  return (
    <div className="lp-root">

      {/* LEFT SIDE (same branding as login) */}
      <div className="lp-left">
        <div className="lp-left-inner">

          <div className="lp-brand">
            <LogoMark />
            <span className="lp-brand-name">MakeADash</span>
          </div>

          <h1 className="lp-headline">
            Join the <span className="lp-headline-accent">Dashboard.</span>
          </h1>

          <p className="lp-tagline">
            Create your workspace and start organizing everything in one place.
          </p>

          <div className="lp-feature-card">
            <SparkleIcon />
            <p>Sign up to access your personalized dashboard and tools.</p>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE (form) */}
      <div className="lp-right">
        <div className="lp-card">

          <div className="lp-card-header">
            <h2>Create Account</h2>
            <p>Start your workspace in seconds.</p>
          </div>

          <form className="lp-form" onSubmit={handleSignup}>

            <div className="lp-field">
              <label>EMAIL ADDRESS</label>
              <input
                type="email"
                placeholder="you@canvasdeck.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="lp-field">
              <label>PASSWORD</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="lp-field">
              <label>CONFIRM PASSWORD</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {error && <p className="lp-error">{error}</p>}

            <button className="lp-btn lp-btn--signin" disabled={loading}>
              {loading ? 'Creating account…' : 'Sign Up'}
            </button>

          </form>

          <p className="lp-signup-prompt">
            Already have an account?{' '}
            <button type="button" className="lp-link">
              Sign in
            </button>
          </p>

        </div>
      </div>

    </div>
  )
}