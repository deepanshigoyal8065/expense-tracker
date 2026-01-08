import { useState, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Modal from './components/Modal'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import Toast from './components/Toast'
import LoadingSkeleton from './components/LoadingSkeleton'
import { useAuth } from './contexts/AuthContext'

// Lazy load page components
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Teams = lazy(() => import('./pages/Teams'))
const TeamDashboard = lazy(() => import('./pages/TeamDashboard'))

function App() {
  const { isAuthenticated, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' or 'signup'

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
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4 overflow-x-hidden">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Expense Tracker</h1>
            <p className="text-sm sm:text-base text-gray-600">Track your expenses, manage your budget</p>
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
      <Suspense fallback={<LoadingSkeleton type="page" />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:teamId" element={<TeamDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App

