import { useState } from 'react'
import ConfirmDialog from './ConfirmDialog'

const TeamExpenseList = ({ expenses, team, currentUser, onEdit, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false)
  const [expenseToDelete, setExpenseToDelete] = useState(null)

  // Handle both populated and unpopulated managerId
  const managerId = team?.managerId?._id || team?.managerId
  const userId = currentUser?.id || currentUser?._id
  const isManager = managerId?.toString() === userId?.toString()

  const handleDeleteClick = (expense) => {
    setExpenseToDelete(expense)
    setShowConfirm(true)
  }

  const handleConfirmDelete = () => {
    if (expenseToDelete && onDelete) {
      onDelete(expenseToDelete._id)
    }
    setShowConfirm(false)
    setExpenseToDelete(null)
  }

  const canEdit = (expense) => {
    const creatorId = expense.createdBy?._id || expense.createdBy
    return isManager || creatorId?.toString() === userId?.toString()
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">No team expenses found</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created By
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {expenses.map((expense) => (
            <tr key={expense._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{expense.title}</div>
                {expense.notes && (
                  <div className="text-sm text-gray-500">{expense.notes}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-gray-900">
                  ₹{expense.amount.toFixed(2)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {expense.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(expense.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {expense.createdBy?.name || 'Unknown'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {canEdit(expense) && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit && onEdit(expense)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(expense)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Expense"
        message={`Are you sure you want to delete "${expenseToDelete?.title}"?`}
      />
    </div>
  )
}

export default TeamExpenseList
