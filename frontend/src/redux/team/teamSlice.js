import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  teams: [],
  currentTeam: null,
  teamExpenses: [],
  teamBudget: null,
  teamSummary: null,
  loading: false,
  error: null,
  currentMonth: new Date().toISOString().slice(0, 7)
}

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    // Fetch teams
    fetchTeamsRequest: (state) => {
      state.loading = true
      state.error = null
    },
    fetchTeamsSuccess: (state, action) => {
      state.loading = false
      state.teams = action.payload
    },
    fetchTeamsFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // Create team
    createTeamRequest: (state) => {
      state.loading = true
      state.error = null
    },
    createTeamSuccess: (state, action) => {
      state.loading = false
      state.teams.unshift(action.payload)
    },
    createTeamFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // Get team details
    getTeamRequest: (state) => {
      state.loading = true
      state.error = null
    },
    getTeamSuccess: (state, action) => {
      state.loading = false
      state.currentTeam = action.payload
    },
    getTeamFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // Update team
    updateTeamRequest: (state) => {
      state.loading = true
      state.error = null
    },
    updateTeamSuccess: (state, action) => {
      state.loading = false
      state.currentTeam = action.payload
      const index = state.teams.findIndex(t => t._id === action.payload._id)
      if (index !== -1) {
        state.teams[index] = action.payload
      }
    },
    updateTeamFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // Add member
    addMemberRequest: (state) => {
      state.loading = true
      state.error = null
    },
    addMemberSuccess: (state, action) => {
      state.loading = false
      state.currentTeam = action.payload
    },
    addMemberFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // Remove member
    removeMemberRequest: (state) => {
      state.loading = true
      state.error = null
    },
    removeMemberSuccess: (state, action) => {
      state.loading = false
      state.currentTeam = action.payload
    },
    removeMemberFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // Fetch team expenses
    fetchTeamExpensesRequest: (state) => {
      state.loading = true
      state.error = null
    },
    fetchTeamExpensesSuccess: (state, action) => {
      state.loading = false
      state.teamExpenses = action.payload
    },
    fetchTeamExpensesFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // Add team expense
    addTeamExpenseRequest: (state) => {
      state.loading = true
      state.error = null
    },
    addTeamExpenseSuccess: (state, action) => {
      state.loading = false
      state.teamExpenses.unshift(action.payload.expense)
      if (action.payload.budget) {
        state.teamBudget = action.payload.budget
      }
    },
    addTeamExpenseFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // Update team expense
    updateTeamExpenseRequest: (state) => {
      state.loading = true
      state.error = null
    },
    updateTeamExpenseSuccess: (state, action) => {
      state.loading = false
      const index = state.teamExpenses.findIndex(e => e._id === action.payload._id)
      if (index !== -1) {
        state.teamExpenses[index] = action.payload
      }
    },
    updateTeamExpenseFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // Delete team expense
    deleteTeamExpenseRequest: (state) => {
      state.loading = true
      state.error = null
    },
    deleteTeamExpenseSuccess: (state, action) => {
      state.loading = false
      state.teamExpenses = state.teamExpenses.filter(e => e._id !== action.payload)
    },
    deleteTeamExpenseFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // Get team summary
    getTeamSummaryRequest: (state) => {
      state.loading = true
      state.error = null
    },
    getTeamSummarySuccess: (state, action) => {
      state.loading = false
      state.teamSummary = action.payload
    },
    getTeamSummaryFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // Set team budget
    setTeamBudgetRequest: (state) => {
      state.loading = true
      state.error = null
    },
    setTeamBudgetSuccess: (state, action) => {
      state.loading = false
      state.teamBudget = action.payload
    },
    setTeamBudgetFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // Set current month
    setCurrentMonth: (state, action) => {
      state.currentMonth = action.payload
    },

    // Clear current team
    clearCurrentTeam: (state) => {
      state.currentTeam = null
      state.teamExpenses = []
      state.teamBudget = null
      state.teamSummary = null
    }
  }
})

export const {
  fetchTeamsRequest,
  fetchTeamsSuccess,
  fetchTeamsFailure,
  createTeamRequest,
  createTeamSuccess,
  createTeamFailure,
  getTeamRequest,
  getTeamSuccess,
  getTeamFailure,
  updateTeamRequest,
  updateTeamSuccess,
  updateTeamFailure,
  addMemberRequest,
  addMemberSuccess,
  addMemberFailure,
  removeMemberRequest,
  removeMemberSuccess,
  removeMemberFailure,
  fetchTeamExpensesRequest,
  fetchTeamExpensesSuccess,
  fetchTeamExpensesFailure,
  addTeamExpenseRequest,
  addTeamExpenseSuccess,
  addTeamExpenseFailure,
  updateTeamExpenseRequest,
  updateTeamExpenseSuccess,
  updateTeamExpenseFailure,
  deleteTeamExpenseRequest,
  deleteTeamExpenseSuccess,
  deleteTeamExpenseFailure,
  getTeamSummaryRequest,
  getTeamSummarySuccess,
  getTeamSummaryFailure,
  setTeamBudgetRequest,
  setTeamBudgetSuccess,
  setTeamBudgetFailure,
  setCurrentMonth,
  clearCurrentTeam
} = teamSlice.actions

export default teamSlice.reducer
