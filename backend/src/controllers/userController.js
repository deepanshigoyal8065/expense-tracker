import { User } from '../models/User.js'

// Get current user profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    res.json(user)
  } catch (err) {
    next(err)
  }
}

// Update user profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, role } = req.body
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (name) user.name = name
    
    // Allow user to upgrade themselves to manager
    if (role === 'manager') {
      user.role = 'manager'
    }

    await user.save()
    
    const updatedUser = await User.findById(user._id).select('-password')
    res.json(updatedUser)
  } catch (err) {
    next(err)
  }
}

// Search users by email (for adding team members)
export const searchUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.query

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('_id name email role')

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
  } catch (err) {
    next(err)
  }
}
