import { createClient } from 'redis'
import { env } from './env.js'

let client  = null    

export const getRedisClient = () => {
  if (!client) {
    client = createClient({ url: env.redisUrl })
    client.on('error', (err) => console.error('Redis Client Error', err))
    client.connect().catch((err) => console.error('Redis connect error', err))
  }
  return client
}
 