import { Expense } from '../models/Expense.js'
import { startEndOfMonth } from '../utils/date.js'

export const getMonthlySummary = async (monthKey, userId) => {
  const { start, end } = startEndOfMonth(monthKey)
  const pipeline = [
    { $match: { userId, date: { $gte: start, $lte: end } } },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $project: { category: '$_id', total: 1, count: 1, _id: 0 } },
    { $sort: { total: -1 } }
  ]

  const categories = await Expense.aggregate(pipeline)
  const totalSpent = categories.reduce((sum, c) => sum + c.total, 0)

  return {
    month: monthKey,
    totalSpent,
    categories
  }
}

export const getMonthlyTotal = async (monthKey, userId) => {
  const { start, end } = startEndOfMonth(monthKey)
  const result = await Expense.aggregate([
    { $match: { userId, date: { $gte: start, $lte: end } } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ])
  return result[0]?.total || 0
}
