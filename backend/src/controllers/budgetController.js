import { Budget } from '../models/Budget.js'
import { getMonthlyTotal } from '../services/reportService.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { sendSuccess, sendError } from '../utils/responseHelpers.js'
import { invalidateMonthCache, setAlert, getCachedOrCompute } from '../utils/cacheHelpers.js'

export const setBudget = asyncHandler(async (req, res) => {
  const { month, limit } = req.body
  if (!month || typeof limit !== 'number') {
    return sendError(res, 'month and numeric limit are required', 400)
  }
  const budget = await Budget.findOneAndUpdate({ userId: req.user._id, month }, { userId: req.user._id, limit }, { upsert: true, new: true })
  await invalidateMonthCache(req.user._id, month)

  const totalSpent = await getMonthlyTotal(month, req.user._id)
  const alertPayload = { month, totalSpent, limit, breached: totalSpent >= limit }
  await setAlert(`alert:${req.user._id}:${month}`, alertPayload)

  sendSuccess(res, { budget, alert: alertPayload })
})

export const getBudget = asyncHandler(async (req, res) => {
  const month = req.query.month
  if (!month) {
    return sendError(res, 'month query param is required', 400)
  }
  const budget = await Budget.findOne({ userId: req.user._id, month })
  const totalSpent = await getMonthlyTotal(month, req.user._id)
  sendSuccess(res, { budget, totalSpent })
})

export const getBudgetAlert = asyncHandler(async (req, res) => {
  const month = req.query.month
  if (!month) {
    return sendError(res, 'month query param is required', 400)
  }
  const cacheKey = `alert:${req.user._id}:${month}`
  const alertData = await getCachedOrCompute(cacheKey, async () => {
    const budget = await Budget.findOne({ userId: req.user._id, month })
    const totalSpent = await getMonthlyTotal(month, req.user._id)
    return { month, totalSpent, limit: budget?.limit || 0, breached: budget ? totalSpent >= budget.limit : false }
  }, 24 * 60 * 60)
  sendSuccess(res, alertData)
})
