import { getMonthlySummary } from '../services/reportService.js'
import { getRedisClient } from '../config/redis.js'

const redis = getRedisClient()

export const getSummary = async (req, res, next) => {
  try {
    const month = req.query.month
    if (!month) {
      return res.status(400).json({ error: 'month query param is required' })
    }

    const cacheKey = `report:${req.user._id}:${month}`
    const cached = await redis.get(cacheKey)
    if (cached) {
      return res.json(JSON.parse(cached))
    }

    const summary = await getMonthlySummary(month, req.user._id)
    await redis.set(cacheKey, JSON.stringify(summary), { EX: 60 * 15 })

    res.json(summary)
  } catch (err) {
    next(err)
  }
}
