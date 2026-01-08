import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { env } from '../config/env.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { formatUserResponse, sendCreated, sendSuccess, sendError } from '../utils/responseHelpers.js'

const generateToken = (id) => {
  return jwt.sign({ id }, env.jwtSecret, { expiresIn: env.jwtExpire })
}

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return sendError(res, 'Please provide name, email and password', 400)
  }

  const userExists = await User.findOne({ email })
  if (userExists) {
    return sendError(res, 'User already exists with this email', 400)
  }

  const user = await User.create({ name, email, password })
  const token = generateToken(user._id)

  sendCreated(res, {
    user: formatUserResponse(user),
    token
  })
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return sendError(res, 'Please provide email and password', 400)
  }

  const user = await User.findOne({ email })

  if (!user || !(await user.comparePassword(password))) {
    return sendError(res, 'Invalid email or password', 401)
  }

  const token = generateToken(user._id)

  sendSuccess(res, {
    user: formatUserResponse(user),
    token
  })
})

export const getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, {
    user: formatUserResponse(req.user)
  })
})
