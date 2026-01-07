import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { connectDb } from './config/db.js'
import { env } from './config/env.js'
import { getRedisClient } from './config/redis.js'
import authRoutes from './routes/authRoutes.js'
import expenseRoutes from './routes/expenseRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

// Middleware
app.use(morgan('dev'))
app.use(cors({ origin: env.corsOrigins }))
app.use(express.json())

// Routes
app.get('/', (req, res) => res.json({ status: 'OK', service: 'Expense Tracker API' }))
app.use('/api/auth', authRoutes)
app.use('/api', expenseRoutes)

// Error handler
app.use(errorHandler)

// Start server
const start = async () => {
  await connectDb()
  getRedisClient()
  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`)
  })
}

start()
