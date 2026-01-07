import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  expenses: [],
  budget: null,
  alert: null,
  summary: null,
  loading: false,
  error: null,
  currentMonth: new Date().toISOString().slice(0, 7) // YYYY-MM format
}

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    // Fetch expenses
    fetchExpensesRequest: (state) => {
      state.loading = true
      state.error = null
    },
    fetchExpensesSuccess: (state, action) => {
      state.loading = false
      state.expenses = action.payload
    },
    fetchExpensesFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // Add expense
    addExpenseRequest: (state) => {
      state.loading = true
      state.error = null
    },
    addExpenseSuccess: (state, action) => {
      state.loading = false
      state.expenses.unshift(action.payload.expense)
      if (action.payload.alert !== undefined) {
        state.alert = action.payload.alert
      }
    },
    addExpenseFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // Set budget
    setBudgetRequest: (state) => {
      state.loading = true
      state.error = null
    },
    setBudgetSuccess: (state, action) => {
      state.loading = false
      state.budget = action.payload.budget
      state.alert = action.payload.alert
    },
    setBudgetFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // Fetch budget
    fetchBudgetRequest: (state) => {
      state.loading = true
      state.error = null
    },
    fetchBudgetSuccess: (state, action) => {
      state.loading = false
      state.budget = action.payload.budget
    },
    fetchBudgetFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // Fetch alert
    fetchAlertRequest: (state) => {
      state.loading = true
      state.error = null
    },
    fetchAlertSuccess: (state, action) => {
      state.loading = false
      state.alert = action.payload
    },
    fetchAlertFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // Fetch summary/report
    fetchSummaryRequest: (state) => {
      state.loading = true
      state.error = null
    },
    fetchSummarySuccess: (state, action) => {
      state.loading = false
      state.summary = action.payload
    },
    fetchSummaryFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // Set current month
    setCurrentMonth: (state, action) => {
      state.currentMonth = action.payload
    }
  }
})

export const {
  fetchExpensesRequest,
  fetchExpensesSuccess,
  fetchExpensesFailure,
  addExpenseRequest,
  addExpenseSuccess,
  addExpenseFailure,
  setBudgetRequest,
  setBudgetSuccess,
  setBudgetFailure,
  fetchBudgetRequest,
  fetchBudgetSuccess,
  fetchBudgetFailure,
  fetchAlertRequest,
  fetchAlertSuccess,
  fetchAlertFailure,
  fetchSummaryRequest,
  fetchSummarySuccess,
  fetchSummaryFailure,
  setCurrentMonth
} = expenseSlice.actions

export default expenseSlice.reducer
