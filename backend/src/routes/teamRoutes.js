import express from 'express'
import {
  createTeam,
  listTeams,
  getTeam,
  updateTeam,
  deleteTeam,
  addMember,
  removeMember,
  updateMemberRole
} from '../controllers/teamController.js'
import {
  listTeamExpenses,
  createTeamExpense,
  updateTeamExpense,
  deleteTeamExpense,
  getTeamSummary,
  setTeamBudget,
  getTeamBudget
} from '../controllers/teamExpenseController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// Team routes
router.post('/', protect, createTeam)
router.get('/', protect, listTeams)
router.get('/:teamId', protect, getTeam)
router.put('/:teamId', protect, updateTeam)
router.delete('/:teamId', protect, deleteTeam)

// Team member routes
router.post('/:teamId/members', protect, addMember)
router.delete('/:teamId/members/:userId', protect, removeMember)
router.put('/:teamId/members/:userId/role', protect, updateMemberRole)

// Team expense routes
router.get('/:teamId/expenses', protect, listTeamExpenses)
router.post('/:teamId/expenses', protect, createTeamExpense)
router.put('/:teamId/expenses/:expenseId', protect, updateTeamExpense)
router.delete('/:teamId/expenses/:expenseId', protect, deleteTeamExpense)

// Team budget and summary routes
router.get('/:teamId/summary', protect, getTeamSummary)
router.post('/:teamId/budget', protect, setTeamBudget)
router.get('/:teamId/budget', protect, getTeamBudget)

export default router
