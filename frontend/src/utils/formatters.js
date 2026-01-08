/**
 * Format date to localized string
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return 'U'
  const names = name.trim().split(' ')
  if (names.length === 1) return names[0].charAt(0).toUpperCase()
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
}

/**
 * Get category color classes
 */
export const getCategoryColor = (category) => {
  const colors = {
    Food: 'bg-green-100 text-green-800',
    Transport: 'bg-blue-100 text-blue-800',
    Entertainment: 'bg-purple-100 text-purple-800',
    Shopping: 'bg-pink-100 text-pink-800',
    Bills: 'bg-red-100 text-red-800',
    Health: 'bg-yellow-100 text-yellow-800',
    Other: 'bg-gray-100 text-gray-800'
  }
  return colors[category] || colors.Other
}

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
  return `₹${Number(amount).toFixed(2)}`
}
