import { getMonthlySummary } from '../services/reportService.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { getCachedOrCompute } from '../utils/cacheHelpers.js'
import { sendSuccess, sendError } from '../utils/responseHelpers.js'

export const getSummary = asyncHandler(async (req, res) => {
  const month = req.query.month
  if (!month) {
    return sendError(res, 'month query param is required', 400)
  }

  const cacheKey = `report:${req.user._id}:${month}`
  const summary = await getCachedOrCompute(
    cacheKey,
    () => getMonthlySummary(month, req.user._id),
    60 * 15 // 15 minutes
  )

  sendSuccess(res, summary)
})
