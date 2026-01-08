import { Team } from '../models/Team.js'

/**
 * Verify team exists and user has access
 * @param {string} teamId - Team ID
 * @param {string} userId - User ID
 * @param {boolean} requireManager - Whether to require manager role
 * @returns {Promise<Team>} Team document
 * @throws {Error} If team not found or access denied
 */
export const verifyTeamAccess = async (teamId, userId, requireManager = false) => {
  const team = await Team.findById(teamId)
  
  if (!team) {
    const error = new Error('Team not found')
    error.status = 404
    throw error
  }

  const isManager = team.isManager(userId)
  const isMember = team.isMember(userId)

  if (requireManager && !isManager) {
    const error = new Error('Only team manager can perform this action')
    error.status = 403
    throw error
  }

  if (!isManager && !isMember) {
    const error = new Error('Access denied')
    error.status = 403
    throw error
  }

  return team
}

/**
 * Check if user can create expenses in team
 */
export const canCreateExpense = (team, userId) => {
  return team.isManager(userId) || (team.isMember(userId) && team.getMemberRole(userId) === 'member')
}
