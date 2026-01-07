import { Router } from 'express'
import { listExpenses, createExpense } from '../controllers/expenseController.js'
import { setBudget, getBudget, getBudgetAlert } from '../controllers/budgetController.js'
import { getSummary } from '../controllers/reportController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

// All routes are protected
router.use(protect)

// expense
router.get('/expenses', listExpenses)
router.post('/expenses', createExpense)

// budget
router.post('/budget', setBudget)
router.get('/budget', getBudget)
router.get('/budget/alert', getBudgetAlert)

// report
router.get('/report/summary', getSummary)

export default router
