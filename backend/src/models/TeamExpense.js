import mongoose from 'mongoose'

const teamExpenseSchema = new mongoose.Schema(
  {
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    notes: { type: String, trim: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' }
  },
  { timestamps: true }
)

teamExpenseSchema.index({ teamId: 1, date: 1 })
teamExpenseSchema.index({ teamId: 1, category: 1 })
teamExpenseSchema.index({ createdBy: 1 })

export const TeamExpense = mongoose.model('TeamExpense', teamExpenseSchema)
