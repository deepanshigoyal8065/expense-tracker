import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import {
  getTeamRequest,
  fetchTeamExpensesRequest,
  addTeamExpenseRequest,
  updateTeamExpenseRequest,
  deleteTeamExpenseRequest,
  getTeamSummaryRequest,
  setTeamBudgetRequest,
  addMemberRequest,
  removeMemberRequest,
  clearCurrentTeam,
  setCurrentMonth
} from '../redux/team/teamSlice'
import { getTeamBudget } from '../services/api'
import TeamMemberList from '../components/TeamMemberList'
import TeamExpenseForm from '../components/TeamExpenseForm'
import TeamExpenseList from '../components/TeamExpenseList'
import Charts from '../components/Charts'
import BudgetAlert from '../components/BudgetAlert'
import ProfileSettings from '../components/ProfileSettings'

const TeamDashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { teamId } = useParams()
  const { currentTeam, teamExpenses, teamSummary, teamBudget, currentMonth } =
    useSelector((state) => state.team)
  const { user } = useSelector((state) => state.auth)

  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [showBudgetForm, setShowBudgetForm] = useState(false)
  const [budgetAmount, setBudgetAmount] = useState('')
  const [activeTab, setActiveTab] = useState('expenses')
  const [loadedBudget, setLoadedBudget] = useState(null)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showProfileSettings, setShowProfileSettings] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getInitials = (name) => {
    if (!name) return 'U'
    const names = name.trim().split(' ')
    if (names.length === 1) return names[0].charAt(0).toUpperCase()
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
  }

  useEffect(() => {
    if (teamId) {
      dispatch(getTeamRequest(teamId))
      dispatch(fetchTeamExpensesRequest({ teamId, month: currentMonth }))
      dispatch(getTeamSummaryRequest({ teamId, month: currentMonth }))
      
      // Load budget
      getTeamBudget(teamId, currentMonth).then(budget => {
        setLoadedBudget(budget)
      }).catch(() => {
        setLoadedBudget(null)
      })
    }

    return () => {
      dispatch(clearCurrentTeam())
    }
  }, [dispatch, teamId, currentMonth])

  const handleMonthChange = (e) => {
    dispatch(setCurrentMonth(e.target.value))
  }

  const handleAddExpense = (data) => {
    dispatch(addTeamExpenseRequest({ teamId, data }))
    setShowExpenseForm(false)
  }

  const handleEditExpense = (expense) => {
    setEditingExpense(expense)
    setShowExpenseForm(true)
  }

  const handleUpdateExpense = (data) => {
    dispatch(updateTeamExpenseRequest({ teamId, expenseId: editingExpense._id, data }))
    setShowExpenseForm(false)
    setEditingExpense(null)
  }

  const handleDeleteExpense = (expenseId) => {
    dispatch(deleteTeamExpenseRequest({ teamId, expenseId }))
  }

  const handleSetBudget = (e) => {
    e.preventDefault()
    dispatch(
      setTeamBudgetRequest({
        teamId,
        data: { month: currentMonth, limit: parseFloat(budgetAmount) }
      })
    )
    // Update loaded budget
    setLoadedBudget({ teamId, month: currentMonth, limit: parseFloat(budgetAmount) })
    setShowBudgetForm(false)
    setBudgetAmount('')
  }

  const handleAddMember = ({ userId, role }) => {
    dispatch(addMemberRequest({ teamId, userId, role }))
  }

  const handleRemoveMember = (userId) => {
    dispatch(removeMemberRequest({ teamId, userId }))
  }

  // Handle both populated and unpopulated managerId
  const managerId = currentTeam?.managerId?._id || currentTeam?.managerId
  const userId = user?.id || user?._id
  const isManager = managerId?.toString() === userId?.toString()
  
  // Check member role manually since getMemberRole is a backend method
  const memberData = currentTeam?.members?.find(m => {
    const memberId = m.userId?._id || m.userId
    return memberId?.toString() === userId?.toString()
  })
  const memberRole = memberData?.role
  const canCreateExpense = isManager || memberRole === 'member'

  // Use loaded budget or team budget from state
  const currentBudget = loadedBudget || teamBudget
  const alertData = currentBudget && teamSummary
    ? {
        totalSpent: teamSummary.totalSpent,
        limit: currentBudget.limit,
        breached: teamSummary.totalSpent >= currentBudget.limit
      }
    : null

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{currentTeam?.name || 'Team'}</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">{currentTeam?.department || ''}</p>
            </div>
            <div className="flex flex-col items-stretch sm:items-end gap-3">
              <div className="relative self-end" ref={dropdownRef}>
                <button
                  onMouseEnter={() => setShowProfileDropdown(true)}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                >
                  {getInitials(user?.name)}
                </button>
                {showProfileDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50"
                    onMouseLeave={() => setShowProfileDropdown(false)}
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      <p className="text-xs text-blue-600 font-medium mt-1">
                        {user?.role === 'manager' ? '👔 Manager' : '👤 User'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setShowProfileSettings(true)
                        setShowProfileDropdown(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile Settings
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  onClick={() => navigate('/teams')}
                  className="w-full sm:w-auto px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Back to Teams</span>
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full sm:w-auto px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Dashboard</span>
                </button>
                <input
                  type="month"
                  value={currentMonth}
                  onChange={handleMonthChange}
                  className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">

        {/* Budget Alert */}
        {alertData && (
          <div className="mb-4 sm:mb-6">
            <BudgetAlert
              totalSpent={alertData.totalSpent}
              limit={alertData.limit}
              breached={alertData.breached}
            />
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500">Total Spent</h3>
            <p className="mt-2 text-xl sm:text-3xl font-bold text-gray-900">
              ₹{teamSummary?.totalSpent?.toFixed(2) || '0.00'}
            </p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500">Budget</h3>
            <p className="mt-2 text-xl sm:text-3xl font-bold text-blue-600">
              ₹{teamSummary?.budget?.toFixed(2) || '0.00'}
            </p>
            {isManager && (
              <button
                onClick={() => setShowBudgetForm(!showBudgetForm)}
                className="mt-2 text-xs sm:text-sm text-blue-600 hover:text-blue-800"
              >
                Set Budget
              </button>
            )}
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500">
              {(teamSummary?.remaining ?? 0) >= 0 ? 'Remaining' : 'Overused'}
            </h3>
            <p className={`mt-2 text-xl sm:text-3xl font-bold ${(teamSummary?.remaining ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{teamSummary?.remaining !== undefined ? (teamSummary.remaining >= 0 ? teamSummary.remaining.toFixed(2) : Math.abs(teamSummary.remaining).toFixed(2)) : '0.00'}
            </p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500">Expenses</h3>
            <p className="mt-2 text-xl sm:text-3xl font-bold text-gray-900">
              {teamSummary?.expenseCount || 0}
            </p>
          </div>
        </div>

        {/* Budget Form */}
        {showBudgetForm && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow">
            <form onSubmit={handleSetBudget} className="flex items-end space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Amount
                </label>
                <input
                  type="number"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter budget amount"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Set Budget
              </button>
              <button
                type="button"
                onClick={() => setShowBudgetForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('expenses')}
                className={`${
                  activeTab === 'expenses'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Expenses
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`${
                  activeTab === 'members'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Members
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'expenses' && (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Team Expenses</h2>
              {canCreateExpense && (
                <button
                  onClick={() => {
                    setEditingExpense(null)
                    setShowExpenseForm(true)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Expense
                </button>
              )}
            </div>
            <TeamExpenseList
              expenses={teamExpenses}
              team={currentTeam}
              currentUser={user}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
            />
          </div>
        )}

        {activeTab === 'analytics' && teamSummary && (
          <div className="space-y-6">
            <Charts summary={teamSummary} />
          </div>
        )}

        {activeTab === 'members' && (
          <TeamMemberList
            team={currentTeam}
            currentUser={user}
            onAddMember={handleAddMember}
            onRemoveMember={handleRemoveMember}
          />
        )}

        {/* Expense Form */}
        <TeamExpenseForm
          isOpen={showExpenseForm}
          onClose={() => {
            setShowExpenseForm(false)
            setEditingExpense(null)
          }}
          onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
          expense={editingExpense}
        />
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © 2026 Expense Tracker. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Profile Settings Modal */}
      <ProfileSettings
        isOpen={showProfileSettings}
        onClose={() => setShowProfileSettings(false)}
      />
    </div>
  )
}

export default TeamDashboard
