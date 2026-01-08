import { useEffect, useState, lazy, Suspense } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchExpensesRequest, setCurrentMonth } from '../redux/expense/expenseSlice'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'
import BudgetAlert from '../components/BudgetAlert'
import LoadingSkeleton from '../components/LoadingSkeleton'
import ConfirmDialog from '../components/ConfirmDialog'

// Lazy load Charts component (heavy due to recharts library)
const Charts = lazy(() => import('../components/Charts'))

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { currentMonth, error } = useSelector((state) => state.expense)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  useEffect(() => {
    dispatch(fetchExpensesRequest(currentMonth))
  }, [currentMonth, dispatch])

  const handleMonthChange = (e) => {
    dispatch(setCurrentMonth(e.target.value))
  }

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        title="Expense Tracker" 
        subtitle={`Welcome, ${user?.name || 'User'}!`}
        user={user}
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button
            onClick={() => navigate('/teams')}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Teams</span>
          </button>
          <input
            type="month"
            value={currentMonth}
            onChange={handleMonthChange}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </Header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {error && (
          <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <p className="text-sm sm:text-base font-medium">Error: {error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Forms and Budget */}
          <div className="lg:col-span-1 space-y-6">
            <ExpenseForm />
            <BudgetAlert />
          </div>

          {/* Right Column - Lists and Charts */}
          <div className="lg:col-span-2 space-y-6">
            <ExpenseList />
            <Suspense fallback={<LoadingSkeleton type="chart" />}>
              <Charts />
            </Suspense>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <p className="text-center text-gray-600 text-xs sm:text-sm">
            Built with React, Redux, Node.js, MongoDB & Redis | © 2026 Expense Tracker
          </p>
        </div>
      </footer>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleConfirmLogout}
        title="Logout Confirmation"
        message="Are you sure you want to logout? You'll need to login again to access your expenses."
        confirmText="Yes, Logout"
        cancelText="Cancel"
        confirmColor="red"
      />
    </div>
  )
}

export default Dashboard
