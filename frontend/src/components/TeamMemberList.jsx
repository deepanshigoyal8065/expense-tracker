import { useState } from 'react'
import ConfirmDialog from './ConfirmDialog'
import * as api from '../services/api'

const TeamMemberList = ({ team, currentUser, onAddMember, onRemoveMember }) => {
  const [showConfirm, setShowConfirm] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [newMemberRole, setNewMemberRole] = useState('member')
  const [searchError, setSearchError] = useState('')
  const [searching, setSearching] = useState(false)

  // Check if current user is manager - handle both populated and unpopulated managerId
  const managerId = team?.managerId?._id || team?.managerId
  const isManager = managerId?.toString() === currentUser?._id?.toString() || managerId?.toString() === currentUser?.id?.toString()

  const handleRemoveClick = (member) => {
    setMemberToRemove(member)
    setShowConfirm(true)
  }

  const handleConfirmRemove = () => {
    if (memberToRemove && onRemoveMember) {
      onRemoveMember(memberToRemove.userId._id)
    }
    setShowConfirm(false)
    setMemberToRemove(null)
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    setSearchError('')
    setSearching(true)

    try {
      // Search for user by email
      const foundUser = await api.searchUserByEmail(newMemberEmail)

      // Check if user is already a member or the manager
      if (foundUser._id === team.managerId._id) {
        setSearchError('This user is the team manager')
        setSearching(false)
        return
      }

      const isAlreadyMember = team.members?.some(m => m.userId._id === foundUser._id)
      if (isAlreadyMember) {
        setSearchError('This user is already a team member')
        setSearching(false)
        return
      }

      // Add member with userId
      if (onAddMember) {
        onAddMember({ userId: foundUser._id, role: newMemberRole })
      }
      
      setNewMemberEmail('')
      setNewMemberRole('member')
      setShowAddForm(false)
    } catch (error) {
      setSearchError(error.response?.data?.error || 'User not found')
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
        
        {isManager && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {showAddForm ? 'Cancel' : 'Add Member'}
          </button>
        )}
      </div>

      {showAddForm && (
        <form onSubmit={handleAddMember} className="mb-4 p-4 bg-gray-50 rounded-md">
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="email"
                value={newMemberEmail}
                onChange={(e) => {
                  setNewMemberEmail(e.target.value)
                  setSearchError('')
                }}
                placeholder="Member email"
                required
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="member">Member</option>
                <option value="viewer">Viewer</option>
              </select>
              <button
                type="submit"
                disabled={searching}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300"
              >
                {searching ? 'Searching...' : 'Add'}
              </button>
            </div>
            {searchError && (
              <p className="text-sm text-red-600">{searchError}</p>
            )}
            <p className="text-xs text-gray-500">
              💡 Tip: Enter the email address of a registered user to add them to your team
            </p>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {/* Manager */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
          <div>
            <p className="font-medium text-gray-900">{team?.managerId?.name}</p>
            <p className="text-sm text-gray-600">{team?.managerId?.email}</p>
          </div>
          <span className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded-full">
            Manager
          </span>
        </div>

        {/* Members */}
        {team?.members?.map((member) => (
          <div
            key={member._id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
          >
            <div>
              <p className="font-medium text-gray-900">{member.userId?.name}</p>
              <p className="text-sm text-gray-600">{member.userId?.email}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">
                {member.role}
              </span>
              {isManager && (
                <button
                  onClick={() => handleRemoveClick(member)}
                  className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}

        {(!team?.members || team.members.length === 0) && (
          <p className="text-center text-gray-500 py-4">No team members yet</p>
        )}
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmRemove}
        title="Remove Member"
        message={`Are you sure you want to remove ${memberToRemove?.userId?.name} from the team?`}
      />
    </div>
  )
}

export default TeamMemberList
