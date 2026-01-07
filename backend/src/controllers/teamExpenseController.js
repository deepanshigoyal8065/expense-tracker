import { TeamExpense } from '../models/TeamExpense.js'
import { Team } from '../models/Team.js'
import { TeamBudget } from '../models/TeamBudget.js'
import { toMonthKey } from '../utils/date.js'
import { getRedisClient } from '../config/redis.js'

const redis = getRedisClient()

// List team expenses
export const listTeamExpenses = async (req, res, next) => {
  try {
    const { teamId } = req.params
    const monthKey = req.query.month

    // Verify team exists and user has access
    const team = await Team.findById(teamId)
    if (!team) {
      return res.status(404).json({ error: 'Team not found' })
    }

    if (!team.isManager(req.user._id) && !team.isMember(req.user._id)) {
      return res.status(403).json({ error: 'Access denied' })
    }

    const query = { teamId }
    if (monthKey) {
      const [year, month] = monthKey.split('-').map(Number)
      const start = new Date(Date.UTC(year, month - 1, 1))
      const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999))
      query.date = { $gte: start, $lte: end }
    }

    const expenses = await TeamExpense.find(query)
      .populate('createdBy', 'name email')
      .sort({ date: -1 })

    res.json(expenses)
  } catch (err) {
    next(err)
  }
}

// Create team expense
export const createTeamExpense = async (req, res, next) => {
  try {
    const { teamId } = req.params
    const { title, amount, category, date, notes } = req.body

    // Verify team exists and user has access
    const team = await Team.findById(teamId)
    if (!team) {
      return res.status(404).json({ error: 'Team not found' })
    }

    if (!team.isManager(req.user._id) && !team.isMember(req.user._id)) {
      return res.status(403).json({ error: 'Access denied' })
    }

    // Check if user has viewer role (viewers can't create expenses)
    const memberRole = team.getMemberRole(req.user._id)
    if (memberRole === 'viewer') {
      return res.status(403).json({ error: 'Viewers cannot create expenses' })
    }

    if (!title || !amount || !category || !date) {
      return res.status(400).json({ error: 'title, amount, category, date are required' })
    }

    const expense = await TeamExpense.create({
      teamId,
      createdBy: req.user._id,
      title,
      amount,
      category,
      date,
      notes,
      status: 'approved' // Auto-approve for now
    })

    await expense.populate('createdBy', 'name email')

    const monthKey = toMonthKey(date)

    // Invalidate cached report for month
    await redis.del(`team-report:${teamId}:${monthKey}`)

    // Calculate total spent and check budget
    const totalSpent = await getTeamMonthlyTotal(monthKey, teamId)
    const budget = await TeamBudget.findOne({ teamId, month: monthKey })
    const alert = budget && totalSpent >= budget.limit

    if (alert) {
      const alertPayload = { month: monthKey, totalSpent, limit: budget.limit, breached: true }
      await redis.set(`team-alert:${teamId}:${monthKey}`, JSON.stringify(alertPayload), { EX: 24 * 60 * 60 })
    } else {
      await redis.del(`team-alert:${teamId}:${monthKey}`)
    }

    res.status(201).json({ expense, totalSpent, budget, alert })
  } catch (err) {
    next(err)
  }
}

// Update team expense
export const updateTeamExpense = async (req, res, next) => {
  try {
    const { teamId, expenseId } = req.params
    const { title, amount, category, date, notes } = req.body

    // Verify team exists and user has access
    const team = await Team.findById(teamId)
    if (!team) {
      return res.status(404).json({ error: 'Team not found' })
    }

    const expense = await TeamExpense.findById(expenseId)
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' })
    }

    // Only creator or manager can update
    if (
      expense.createdBy.toString() !== req.user._id.toString() &&
      !team.isManager(req.user._id)
    ) {
      return res.status(403).json({ error: 'Access denied' })
    }

    if (title) expense.title = title
    if (amount !== undefined) expense.amount = amount
    if (category) expense.category = category
    if (date) expense.date = date
    if (notes !== undefined) expense.notes = notes

    await expense.save()
    await expense.populate('createdBy', 'name email')

    // Invalidate cache
    const monthKey = toMonthKey(expense.date)
    await redis.del(`team-report:${teamId}:${monthKey}`)

    res.json(expense)
  } catch (err) {
    next(err)
  }
}

// Delete team expense
export const deleteTeamExpense = async (req, res, next) => {
  try {
    const { teamId, expenseId } = req.params

    // Verify team exists and user has access
    const team = await Team.findById(teamId)
    if (!team) {
      return res.status(404).json({ error: 'Team not found' })
    }

    const expense = await TeamExpense.findById(expenseId)
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' })
    }

    // Only creator or manager can delete
    if (
      expense.createdBy.toString() !== req.user._id.toString() &&
      !team.isManager(req.user._id)
    ) {
      return res.status(403).json({ error: 'Access denied' })
    }

    const monthKey = toMonthKey(expense.date)
    await expense.deleteOne()

    // Invalidate cache
    await redis.del(`team-report:${teamId}:${monthKey}`)

    res.json({ message: 'Expense deleted successfully' })
  } catch (err) {
    next(err)
  }
}

// Get team monthly summary
export const getTeamSummary = async (req, res, next) => {
  try {
    const { teamId } = req.params
    const monthKey = req.query.month || toMonthKey(new Date())

    // Verify team exists and user has access
    const team = await Team.findById(teamId)
    if (!team) {
      return res.status(404).json({ error: 'Team not found' })
    }

    if (!team.isManager(req.user._id) && !team.isMember(req.user._id)) {
      return res.status(403).json({ error: 'Access denied' })
    }

    // Try cache first
    const cacheKey = `team-report:${teamId}:${monthKey}`
    const cached = await redis.get(cacheKey)
    if (cached) {
      return res.json(JSON.parse(cached))
    }

    const [year, month] = monthKey.split('-').map(Number)
    const start = new Date(Date.UTC(year, month - 1, 1))
    const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999))

    const expenses = await TeamExpense.find({
      teamId,
      date: { $gte: start, $lte: end }
    }).populate('createdBy', 'name email')

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
    
    // Category breakdown
    const byCategory = {}
    expenses.forEach(e => {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount
    })

    // Member breakdown
    const byMember = {}
    expenses.forEach(e => {
      const memberId = e.createdBy._id.toString()
      const memberName = e.createdBy.name
      if (!byMember[memberId]) {
        byMember[memberId] = { name: memberName, total: 0, count: 0 }
      }
      byMember[memberId].total += e.amount
      byMember[memberId].count += 1
    })

    const budget = await TeamBudget.findOne({ teamId, month: monthKey })

    const summary = {
      month: monthKey,
      totalSpent,
      budget: budget?.limit || 0,
      remaining: budget ? budget.limit - totalSpent : 0,
      byCategory,
      byMember,
      expenseCount: expenses.length
    }

    // Cache for 5 minutes
    await redis.set(cacheKey, JSON.stringify(summary), { EX: 300 })

    res.json(summary)
  } catch (err) {
    next(err)
  }
}

// Set team budget
export const setTeamBudget = async (req, res, next) => {
  try {
    const { teamId } = req.params
    const { month, limit, categoryLimits } = req.body

    // Verify team exists and user is manager
    const team = await Team.findById(teamId)
    if (!team) {
      return res.status(404).json({ error: 'Team not found' })
    }

    if (!team.isManager(req.user._id)) {
      return res.status(403).json({ error: 'Only team manager can set budget' })
    }

    if (!month || limit === undefined) {
      return res.status(400).json({ error: 'month and limit are required' })
    }

    const budget = await TeamBudget.findOneAndUpdate(
      { teamId, month },
      { limit, categoryLimits: categoryLimits || [] },
      { upsert: true, new: true }
    )

    // Invalidate cache
    await redis.del(`team-report:${teamId}:${month}`)

    res.json(budget)
  } catch (err) {
    next(err)
  }
}

// Get team budget
export const getTeamBudget = async (req, res, next) => {
  try {
    const { teamId } = req.params
    const monthKey = req.query.month || toMonthKey(new Date())

    // Verify team exists and user has access
    const team = await Team.findById(teamId)
    if (!team) {
      return res.status(404).json({ error: 'Team not found' })
    }

    if (!team.isManager(req.user._id) && !team.isMember(req.user._id)) {
      return res.status(403).json({ error: 'Access denied' })
    }

    const budget = await TeamBudget.findOne({ teamId, month: monthKey })
    res.json(budget || { teamId, month: monthKey, limit: 0, categoryLimits: [] })
  } catch (err) {
    next(err)
  }
}

// Helper function to get team monthly total
async function getTeamMonthlyTotal(monthKey, teamId) {
  const [year, month] = monthKey.split('-').map(Number)
  const start = new Date(Date.UTC(year, month - 1, 1))
  const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999))

  const result = await TeamExpense.aggregate([
    {
      $match: {
        teamId: teamId,
        date: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ])

  return result.length > 0 ? result[0].total : 0
}
