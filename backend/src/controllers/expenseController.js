import { Expense } from '../models/Expense.js'
import { Budget } from '../models/Budget.js'
import { getMonthlySummary, getMonthlyTotal } from '../services/reportService.js'
import { toMonthKey } from '../utils/date.js'
import { getRedisClient } from '../config/redis.js'

const redis = getRedisClient()

export const listExpenses = async (req, res, next) => {
  try {
    const monthKey = req.query.month
    const query = { userId: req.user._id }
    if (monthKey) {
      const [year, month] = monthKey.split('-').map(Number)
      const start = new Date(Date.UTC(year, month - 1, 1))
      const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999))
      query.date = { $gte: start, $lte: end }
    }
    const expenses = await Expense.find(query).sort({ date: -1 })
    res.json(expenses)
  } catch (err) {
    next(err)
  }
}

export const createExpense = async (req, res, next) => {
  try {
    const { title, amount, category, date, notes } = req.body
    if (!title || !amount || !category || !date) {
      return res.status(400).json({ error: 'title, amount, category, date are required' })
    }

    const expense = await Expense.create({ userId: req.user._id, title, amount, category, date, notes })
    const monthKey = toMonthKey(date)

    // invalidate cached report for month
    await redis.del(`report:${req.user._id}:${monthKey}`)

    const totalSpent = await getMonthlyTotal(monthKey, req.user._id)
    const budget = await Budget.findOne({ userId: req.user._id, month: monthKey })
    const alert = budget && totalSpent >= budget.limit

    if (alert) {
      const alertPayload = { month: monthKey, totalSpent, limit: budget.limit, breached: true }
      await redis.set(`alert:${req.user._id}:${monthKey}`, JSON.stringify(alertPayload), { EX: 24 * 60 * 60 })
    } else {
      await redis.del(`alert:${req.user._id}:${monthKey}`)
    }

    res.status(201).json({ expense, totalSpent, budget, alert })
  } catch (err) {
    next(err)
  }
}
