import { Link } from 'react-router-dom'

const TeamList = ({ teams, onTeamClick }) => {
  if (!teams || teams.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No teams found. Create your first team!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {teams.map((team) => (
        <div
          key={team._id}
          onClick={() => onTeamClick && onTeamClick(team._id)}
          className="bg-white p-4 sm:p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
        >
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{team.name}</h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-3">{team.department}</p>
          {team.description && (
            <p className="text-xs sm:text-sm text-gray-500 mb-4 line-clamp-2">{team.description}</p>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm gap-1 sm:gap-0">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap">
              <span className="text-gray-600">
                <span className="font-medium">{team.members?.length || 0}</span> members
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">
                Manager: {team.managerId?.name || 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TeamList
