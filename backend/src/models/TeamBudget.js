import mongoose from 'mongoose'

const teamBudgetSchema = new mongoose.Schema(
  {
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    month: { type: String, required: true }, // YYYY-MM format
    limit: { type: Number, required: true, min: 0 },
    categoryLimits: [{
      category: { type: String, required: true },
      limit: { type: Number, required: true, min: 0 }
    }]
  },
  { timestamps: true }
)

teamBudgetSchema.index({ teamId: 1, month: 1 }, { unique: true })

export const TeamBudget = mongoose.model('TeamBudget', teamBudgetSchema)
