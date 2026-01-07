// Helper script to upgrade a user to manager role
// Run this with: node backend/src/scripts/makeManager.js <email>

import mongoose from 'mongoose'
import { User } from '../models/User.js'
import { connectDb } from '../config/db.js'

const makeManager = async (email) => {
  try {
    await connectDb()
    
    const user = await User.findOne({ email: email.toLowerCase() })
    
    if (!user) {
      console.error(`❌ User not found with email: ${email}`)
      process.exit(1)
    }
    
    if (user.role === 'manager') {
      console.log(`ℹ️  User ${email} is already a manager`)
      process.exit(0)
    }
    
    user.role = 'manager'
    await user.save()
    
    console.log(`✅ Successfully upgraded ${email} to manager role!`)
    console.log(`User ID: ${user._id}`)
    console.log(`Name: ${user.name}`)
    
    process.exit(0)
  } catch (error) {
    console.error('Error upgrading user:', error)
    process.exit(1)
  }
}

// Get email from command line argument
const email = process.argv[2]

if (!email) {
  console.error('Usage: node makeManager.js <email>')
  process.exit(1)
}

makeManager(email)
