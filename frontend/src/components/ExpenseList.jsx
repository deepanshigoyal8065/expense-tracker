import { useState } from 'react'
import { useSelector } from 'react-redux'

const ExpenseList = () => {
  const { expenses, loading } = useSelector((state) => state.expense)
  const [isCollapsed, setIsCollapsed] = useState(false)

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-center text-gray-500">Loading expenses...</p>
      </div>
    )
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Recent Expenses</h2>
        <p className="text-center text-gray-500 py-8">No expenses found. Add your first expense!</p>
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category) => {
    const colors = {
      Food: 'bg-green-100 text-green-800',
      Transport: 'bg-blue-100 text-blue-800',
      Entertainment: 'bg-purple-100 text-purple-800',
      Shopping: 'bg-pink-100 text-pink-800',
      Bills: 'bg-red-100 text-red-800',
      Health: 'bg-yellow-100 text-yellow-800',
      Other: 'bg-gray-100 text-gray-800'
    }
    return colors[category] || colors.Other
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Recent Expenses</h2>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-600 hover:text-gray-900 transition-colors"
          aria-label={isCollapsed ? 'Expand' : 'Collapse'}
        >
          <svg
            className={`w-6 h-6 transform transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      {!isCollapsed && (
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {expenses.map((expense) => (
          <div
            key={expense._id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors gap-2"
          >
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{expense.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                  {expense.category}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500">{formatDate(expense.date)}</p>
              {expense.notes && <p className="text-xs sm:text-sm text-gray-600 mt-1">{expense.notes}</p>}
            </div>
            <div className="text-right sm:text-left">
              <p className="text-lg sm:text-xl font-bold text-gray-900">₹{expense.amount.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>      )}    </div>
  )
}

export default ExpenseList
