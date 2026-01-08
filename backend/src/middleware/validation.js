import { sendError } from '../utils/responseHelpers.js'

/**
 * Middleware to validate required fields in request body
 */
export const validateFields = (requiredFields) => {
  return (req, res, next) => {
    const missing = requiredFields.filter(field => !req.body[field])
    if (missing.length > 0) {
      return sendError(res, `Missing required fields: ${missing.join(', ')}`, 400)
    }
    next()
  }
}

/**
 * Middleware to validate query parameters
 */
export const validateQuery = (requiredParams) => {
  return (req, res, next) => {
    const missing = requiredParams.filter(param => !req.query[param])
    if (missing.length > 0) {
      return sendError(res, `Missing required query parameters: ${missing.join(', ')}`, 400)
    }
    next()
  }
}

/**
 * Middleware to check if user is a manager
 */
export const requireManager = (req, res, next) => {
  if (req.user.role !== 'manager') {
    return sendError(res, 'Only managers can perform this action', 403)
  }
  next()
}
