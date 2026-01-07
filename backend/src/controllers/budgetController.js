import { Budget } from '../models/Budget.js'
import { getMonthlyTotal } from '../services/reportService.js'
import { getRedisClient } from '../config/redis.js'

const redis = getRedisClient()

export const setBudget = async (req, res, next) => {
  try {
    const { month, limit } = req.body
    if (!month || typeof limit !== 'number') {
      return res.status(400).json({ error: 'month and numeric limit are required' })
    }
    const budget = await Budget.findOneAndUpdate({ userId: req.user._id, month }, { userId: req.user._id, limit }, { upsert: true, new: true })
    await redis.del(`report:${req.user._id}:${month}`)

    const totalSpent = await getMonthlyTotal(month, req.user._id)
    const alertPayload = { month, totalSpent, limit, breached: totalSpent >= limit }
    await redis.set(`alert:${req.user._id}:${month}`, JSON.stringify(alertPayload), { EX: 24 * 60 * 60 })

    res.json({ budget, alert: alertPayload })
  } catch (err) {
    next(err)
  }
}

export const getBudget = async (req, res, next) => {
  try {
    const month = req.query.month
    if (!month) {
      return res.status(400).json({ error: 'month query param is required' })
    }
    const budget = await Budget.findOne({ userId: req.user._id, month })
    const totalSpent = await getMonthlyTotal(month, req.user._id)
    res.json({ budget, totalSpent })
  } catch (err) {
    next(err)
  }
}

export const getBudgetAlert = async (req, res, next) => {
  try {
    const month = req.query.month
    if (!month) {
      return res.status(400).json({ error: 'month query param is required' })
    }
    const cached = await redis.get(`alert:${req.user._id}:${month}`)
    if (cached) {
      return res.json(JSON.parse(cached))
    }
    const budget = await Budget.findOne({ userId: req.user._id, month })
    const totalSpent = await getMonthlyTotal(month, req.user._id)
    const payload = { month, totalSpent, limit: budget?.limit || 0, breached: budget ? totalSpent >= budget.limit : false }
    await redis.set(`alert:${req.user._id}:${month}`, JSON.stringify(payload), { EX: 24 * 60 * 60 })
    res.json(payload)
  } catch (err) {
    next(err)
  }
}
