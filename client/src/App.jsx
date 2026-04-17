import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import WorkboardsPage from './pages/WorkboardsPage'
import SettingsPage from './pages/SettingsPage'
import './App.css'

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setUser(null)
  }

  // Single source of truth for auth state
  useEffect(() => {
    // Check existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes (login, logout, token refresh)
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (loading) return null

  return (
    <Router>
      <Routes>

        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />

        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignupPage />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <DashboardPage onLogout={handleLogout} user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/workboards"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <WorkboardsPage onLogout={handleLogout} user={user} />
            </ProtectedRoute>
          }
        />

        <Route
  path="/settings"
  element={
    <ProtectedRoute isAuthenticated={isAuthenticated}>
      <SettingsPage user={user} onLogout={handleLogout} />
    </ProtectedRoute>
  }
/>

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  )
}

export default App

