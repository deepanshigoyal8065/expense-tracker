/**
 * Response helper utilities
 */

export const sendSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).json(data)
}

export const sendError = (res, message, statusCode = 400) => {
  res.status(statusCode).json({ error: message })
}

export const sendCreated = (res, data) => {
  res.status(201).json(data)
}

/**
 * Format user response object
 */
export const formatUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role
})
