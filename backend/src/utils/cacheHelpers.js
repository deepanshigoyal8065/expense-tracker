import { getRedisClient } from '../config/redis.js'

const redis = getRedisClient()

/**
 * Get cached data or compute and cache it
 * @param {string} key - Cache key
 * @param {Function} computeFn - Function to compute data if not cached
 * @param {number} ttl - Time to live in seconds (default: 15 minutes)
 * @returns {Promise<any>} Cached or computed data
 */
export const getCachedOrCompute = async (key, computeFn, ttl = 60 * 15) => {
  const cached = await redis.get(key)
  if (cached) {
    return JSON.parse(cached)
  }

  const data = await computeFn()
  await redis.set(key, JSON.stringify(data), { EX: ttl })
  return data
}

/**
 * Invalidate cache keys by pattern
 * @param {string} userId - User ID
 * @param {string} monthKey - Month key
 */
export const invalidateMonthCache = async (userId, monthKey) => {
  await redis.del(`report:${userId}:${monthKey}`)
  await redis.del(`alert:${userId}:${monthKey}`)
}

/**
 * Invalidate team cache
 * @param {string} teamId - Team ID
 * @param {string} monthKey - Month key
 */
export const invalidateTeamCache = async (teamId, monthKey) => {
  await redis.del(`team-report:${teamId}:${monthKey}`)
  await redis.del(`team-alert:${teamId}:${monthKey}`)
}

/**
 * Set alert in cache
 * @param {string} key - Cache key
 * @param {object} alertData - Alert data
 * @param {number} ttl - Time to live in seconds (default: 24 hours)
 */
export const setAlert = async (key, alertData, ttl = 24 * 60 * 60) => {
  await redis.set(key, JSON.stringify(alertData), { EX: ttl })
}
