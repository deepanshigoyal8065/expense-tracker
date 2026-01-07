import mongoose from 'mongoose'

const expenseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    notes: { type: String, trim: true }
  },
  { timestamps: true }
)

expenseSchema.index({ userId: 1, date: 1 })
expenseSchema.index({ userId: 1, category: 1 })

export const Expense = mongoose.model('Expense', expenseSchema)
