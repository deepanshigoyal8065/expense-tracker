import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Box,
  Typography
} from '@mui/material'
import ConfirmDialog from './ConfirmDialog'
import { formatDate, getCategoryColor } from '../utils/formatters'

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

  const renderExpenseRow = (expense) => (
    <TableRow key={expense._id} hover>
      <TableCell>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {expense.title}
        </Typography>
        {expense.notes && (
          <Typography variant="caption" color="text.secondary">
            {expense.notes}
          </Typography>
        )}
      </TableCell>
      <TableCell>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          ₹{expense.amount.toFixed(2)}
        </Typography>
      </TableCell>
      <TableCell>
        <Chip
          label={expense.category}
          size="small"
          className={getCategoryColor(expense.category)}
        />
      </TableCell>
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {formatDate(expense.date)}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {expense.createdBy?.name || 'Unknown'}
        </Typography>
      </TableCell>
      <TableCell>
        {canEdit(expense) && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              onClick={() => onEdit && onEdit(expense)}
              sx={{ textTransform: 'none' }}
            >
              Edit
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => handleDeleteClick(expense)}
              sx={{ textTransform: 'none' }}
            >
              Delete
            </Button>
          </Box>
        )}
      </TableCell>
    </TableRow>
  )

  if (!expenses || expenses.length === 0) {
    return (
      <Paper elevation={1} sx={{ textAlign: 'center', py: 6 }}>
        <Typography color="text.secondary">No team expenses found</Typography>
      </Paper>
    )
  }

  return (
    <Box>
      <TableContainer component={Paper} elevation={1}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Created By</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => renderExpenseRow(expense))}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Expense"
        message={`Are you sure you want to delete "${expenseToDelete?.title}"?`}
      />
    </Box>
  )
}

export default TeamExpenseList
