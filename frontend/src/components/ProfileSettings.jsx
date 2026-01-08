import { useState } from 'react'
import Modal from './Modal'
import * as api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'


const ProfileSettings = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleUpgradeToManager = async () => {
    try {
      setLoading(true)
      setMessage('')
      const response = await api.updateProfile({ role: 'manager' })
      
      // Update user in auth context
      updateUser(response.data)
      
      setMessage('✓ Successfully upgraded to Manager!')
      addToast({ message: 'Successfully upgraded to Manager!', type: 'success' })
      setTimeout(() => {
        onClose()
      }, 800)
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message
      setMessage('Error: ' + errorMsg)
      addToast({ message: errorMsg, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Profile Settings">
      <div className="space-y-6">
        {/* User Info */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">User Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Name:</span>
              <span className="text-sm font-medium text-gray-900">{user?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Email:</span>
              <span className="text-sm font-medium text-gray-900">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Role:</span>
              <span className={`text-sm font-semibold ${user?.role === 'manager' ? 'text-blue-600' : 'text-gray-600'}`}>
                {user?.role === 'manager' ? 'Manager' : 'User'}
              </span>
            </div>
          </div>
        </div>

        {/* Upgrade to Manager */}
        {user?.role !== 'manager' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Upgrade to Manager</h3>
            <p className="text-sm text-blue-700 mb-4">
              As a Manager, you can create teams, manage team members, and track team expenses.
            </p>
            <button
              onClick={handleUpgradeToManager}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Upgrading...' : 'Become a Manager'}
            </button>
          </div>
        )}

        {/* Manager Features */}
        {user?.role === 'manager' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-green-900 mb-2">✓ Manager Features Enabled</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Create and manage teams</li>
              <li>• Add and remove team members</li>
              <li>• Set team budgets</li>
              <li>• Track team expenses</li>
            </ul>
          </div>
        )}

        {/* Message */}
        {message && (
          <div className={`p-3 rounded-md ${message.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            <p className="text-sm">{message}</p>
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ProfileSettings
