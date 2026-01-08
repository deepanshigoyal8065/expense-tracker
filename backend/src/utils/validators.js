/**
 * Validation utilities
 */

export const validateRequiredFields = (data, requiredFields) => {
  const missing = requiredFields.filter(field => !data[field])
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`)
  }
}

export const validateMonthFormat = (month) => {
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    throw new Error('Invalid month format. Expected YYYY-MM')
  }
}

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format')
  }
}
