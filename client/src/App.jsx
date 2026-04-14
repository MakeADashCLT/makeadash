import { useState } from 'react'
import { useEffect } from 'react'
import { supabase } from './supabaseClient'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import WorkboardsPage from './pages/WorkboardsPage'
import './App.css'

/**
 * Canvas Deck – The Digital Atelier
 *
 * Route map:
 *   /           → redirect to /login (unauthenticated) or /dashboard
 *   /login      → LoginPage            (public)
 *   /dashboard  → DashboardPage        (protected)
 *   /workboards → WorkboardsPage       (protected)
 *
 * Auth is a simple in-memory boolean for now.
 * Swap isAuthenticated with a real context / JWT check once the
 * Canvas OAuth backend is wired up.
 */

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin  = () => setIsAuthenticated(true)
  const handleLogout = () => setIsAuthenticated(false)

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
        }
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])
  
  useEffect(() => {
  const initSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()

    if (session) {
      setIsAuthenticated(true)
    }
  }

  initSession()
}, [])

  return (
    <Router>
      <Routes>

        {/* Root – smart redirect */}
        <Route
          path="/"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login"    replace />
          }
        />

        {/* Public routes */}
        <Route
          path="/login"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <LoginPage onLogin={handleLogin} />
          }
        />

        {/* Signup route */}
        <Route
          path="/signup"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <SignupPage onSignup={handleLogin} />
          }
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <DashboardPage onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workboards"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <WorkboardsPage onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Catch-all → root */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  )
}

export default App