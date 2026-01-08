import { useState, useEffect, lazy, Suspense } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchTeamsRequest, createTeamRequest } from '../redux/team/teamSlice'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import TeamForm from '../components/TeamForm'
import LoadingSkeleton from '../components/LoadingSkeleton'

// Lazy load TeamList component
const TeamList = lazy(() => import('../components/TeamList'))

const Teams = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { teams, loading } = useSelector((state) => state.team)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    dispatch(fetchTeamsRequest())
  }, [dispatch])

  const handleCreateTeam = (data) => {
    dispatch(createTeamRequest(data))
    setShowCreateForm(false)
  }

  const handleTeamClick = (teamId) => {
    navigate(`/teams/${teamId}`)
  }

  const isManager = user?.role === 'manager'

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header 
        title="Team Expenses" 
        subtitle="Manage and track expenses for your teams"
        user={user}
      >
        <button
          onClick={() => navigate('/')}
          className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Dashboard</span>
        </button>
      </Header>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          {isManager && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Create Team</span>
            </button>
          )}
        </div>

        {/* Not a Manager Notice */}
        {!isManager && (
          <div className="mb-6 sm:mb-8 bg-blue-50 border-l-4 border-blue-400 p-4 sm:p-6 rounded-r-lg shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-blue-800">
                  Want to create a team?
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    To create and manage teams, you need to become a Manager. 
                    Please go to Profile Settings and upgrade your account to Manager role.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Teams List */}
        {loading ? (
          <LoadingSkeleton type="list" />
        ) : (
          <Suspense fallback={<LoadingSkeleton type="list" />}>
            <TeamList teams={teams} onTeamClick={handleTeamClick} />
          </Suspense>
        )}

        {/* Create Team Form */}
        <TeamForm
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateTeam}
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
    </div>
  )
}

export default Teams
