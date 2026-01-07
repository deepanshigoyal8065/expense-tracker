

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { loadUserRequest, logout } from './redux/auth/authSlice'
import Dashboard from './pages/Dashboard'
import Teams from './pages/Teams'
import TeamDashboard from './pages/TeamDashboard'
import Modal from './components/Modal'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import Toast from './components/Toast'

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' or 'signup'

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      dispatch(loadUserRequest())
    }
  }, [dispatch])

  useEffect(() => {
    if (isAuthenticated) {
      setShowAuthModal(false)
    }
  }, [isAuthenticated])

  const handleLogout = () => {
    dispatch(logout())
  }

  const handleSwitchMode = () => {
    setAuthMode((prev) => (prev === 'login' ? 'signup' : 'login'))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Expense Tracker</h1>
            <p className="text-gray-600">Track your expenses, manage your budget</p>
          </div>

          {authMode === 'login' ? (
            <LoginForm onSwitchToSignup={handleSwitchMode} />
          ) : (
            <SignupForm onSwitchToLogin={handleSwitchMode} />
          )}
        </div>

        <Modal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          title={authMode === 'login' ? 'Login' : 'Sign Up'}
        >
          {authMode === 'login' ? (
            <LoginForm onSwitchToSignup={handleSwitchMode} />
          ) : (
            <SignupForm onSwitchToLogin={handleSwitchMode} />
          )}
        </Modal>
      </div>
    )
  }

  return (
    <Router>
      <Toast />
      <Routes>
        <Route path="/" element={<Dashboard user={user} onLogout={handleLogout} />} />
        <Route path="/teams" element={<Teams user={user} onLogout={handleLogout} />} />
        <Route path="/teams/:teamId" element={<TeamDashboard user={user} onLogout={handleLogout} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App

