import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { setBudgetRequest, fetchBudgetRequest, fetchAlertRequest } from '../redux/expense/expenseSlice'
import { useToast } from '../contexts/ToastContext'

const BudgetAlert = ({ totalSpent: propTotalSpent, limit: propLimit, breached: propBreached }) => {
  const dispatch = useDispatch()
  const { addToast } = useToast()
  const { budget: reduxBudget, alert: reduxAlert, currentMonth } = useSelector((state) => state.expense)
  const [budgetInput, setBudgetInput] = useState('')
  const [showForm, setShowForm] = useState(false)
  const prevAlertRef = useRef(null)

  // Use props if provided (for team expenses), otherwise use Redux state (for personal expenses)
  const isTeamMode = propTotalSpent !== undefined && propLimit !== undefined
  const budget = isTeamMode ? { limit: propLimit } : reduxBudget
  const alert = isTeamMode ? { totalSpent: propTotalSpent, limit: propLimit, breached: propBreached } : reduxAlert

  useEffect(() => {
    // Only fetch personal budget/alert if not in team mode
    if (!isTeamMode) {
      dispatch(fetchBudgetRequest(currentMonth))
      dispatch(fetchAlertRequest(currentMonth))
    }
  }, [currentMonth, dispatch, isTeamMode])

  useEffect(() => {
    // Check if budget was just exceeded
    if (alert && budget && alert.breached) {
      const wasNotExceeded = prevAlertRef.current === null || !prevAlertRef.current.breached
      const isNowExceeded = alert.breached
      
      if (wasNotExceeded && isNowExceeded) {
        // Show alert toast when budget is first exceeded
        addToast({
          message: `🚨 ALERT! You have exceeded your monthly budget by ₹${(alert.totalSpent - alert.limit).toFixed(2)}!`,
          type: 'error',
          duration: 5000
        })
      }
    }
    prevAlertRef.current = alert
  }, [alert, budget, addToast])

  const handleSetBudget = (e) => {
    e.preventDefault()
    if (!budgetInput || parseFloat(budgetInput) <= 0) {
      addToast({ message: 'Please enter a valid budget amount', type: 'error' })
      return
    }
    dispatch(setBudgetRequest({ month: currentMonth, limit: parseFloat(budgetInput) }))
    addToast({ message: 'Budget set successfully!', type: 'success' })
    setBudgetInput('')
    setShowForm(false)
  }

  const getPercentage = () => {
    if (!alert || !alert.limit) return 0
    return Math.min((alert.totalSpent / alert.limit) * 100, 100)
  }

  const percentage = getPercentage()
  const isNearLimit = percentage >= 80 && percentage < 100
  const isOverLimit = percentage >= 100

  return (
    <div className={`bg-white p-4 sm:p-6 rounded-lg shadow-md transition-all ${isOverLimit ? 'animate-blink border-4 border-red-600' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Monthly Budget</h2>
        {!isTeamMode && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition-colors"
          >
            {budget ? 'Update' : 'Set'} Budget
          </button>
        )}
      </div>

      {showForm && !isTeamMode && (
        <form onSubmit={handleSetBudget} className="mb-4 flex gap-2">
          <input
            type="number"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
            placeholder="Enter budget limit"
            step="0.01"
            min="0"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </form>
      )}

      {budget ? (
        <div>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Spent</span>
              <span className="font-medium">
                ₹{alert?.totalSpent?.toFixed(2) || '0.00'} / ₹{budget.limit.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isOverLimit ? 'bg-red-600' : isNearLimit ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="text-right text-sm text-gray-600 mt-1">{percentage.toFixed(1)}%</div>
          </div>

          {isOverLimit && (
            <div className="bg-red-50 border-2 border-red-500 rounded-md p-4 animate-blink shadow-lg">
              <div className="flex items-center gap-3">
                <span className="text-3xl animate-pulse-custom">🚨</span>
                <div className="flex-1">
                  <p className="font-bold text-red-900 text-lg">⚠️ Budget Exceeded!</p>
                  <p className="text-sm text-red-800 font-semibold mt-1">
                    You&apos;ve exceeded your budget by ₹{(alert.totalSpent - budget.limit).toFixed(2)}
                  </p>
                  <p className="text-xs text-red-700 mt-1">Please reduce your spending or adjust your budget.</p>
                </div>
              </div>
            </div>
          )}

          {isNearLimit && !isOverLimit && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="font-semibold text-yellow-800">Approaching Limit</p>
                  <p className="text-sm text-yellow-700">
                    You&apos;ve used {percentage.toFixed(1)}% of your budget
                  </p>
                </div>
              </div>
            </div>
          )}

          {!isNearLimit && !isOverLimit && alert?.totalSpent > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-semibold text-green-800">On Track</p>
                  <p className="text-sm text-green-700">
                    ₹{(budget.limit - alert.totalSpent).toFixed(2)} remaining
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No budget set for {currentMonth}</p>
          <p className="text-sm mt-2">Click &quot;Set Budget&quot; to get started</p>
        </div>
      )}
    </div>
  )
}

BudgetAlert.propTypes = {
  totalSpent: PropTypes.number,
  limit: PropTypes.number,
  breached: PropTypes.bool
}

export default BudgetAlert
