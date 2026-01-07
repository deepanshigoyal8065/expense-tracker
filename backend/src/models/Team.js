import mongoose from 'mongoose'

const teamMemberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['manager', 'member', 'viewer'], default: 'member' },
  joinedAt: { type: Date, default: Date.now }
})

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    department: { type: String, required: true, trim: true },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [teamMemberSchema],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
)

teamSchema.index({ managerId: 1 })
teamSchema.index({ 'members.userId': 1 })
teamSchema.index({ department: 1 })

// Method to check if user is a member of the team
teamSchema.methods.isMember = function (userId) {
  return this.members.some(m => m.userId.toString() === userId.toString())
}

// Method to check if user is manager
teamSchema.methods.isManager = function (userId) {
  return this.managerId.toString() === userId.toString()
}

// Method to get member role
teamSchema.methods.getMemberRole = function (userId) {
  if (this.isManager(userId)) return 'manager'
  const member = this.members.find(m => m.userId.toString() === userId.toString())
  return member ? member.role : null
}

export const Team = mongoose.model('Team', teamSchema)
