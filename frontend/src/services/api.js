import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL 

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
})

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Auth endpoints
export const signup = (data) => api.post('/auth/signup', data).then(res => res.data)
export const login = (data) => api.post('/auth/login', data).then(res => res.data)
export const loadUser = () => api.get('/auth/me').then(res => res.data)
export const updateProfile = (data) => api.put('/auth/profile', data)
export const searchUserByEmail = (email) => api.get('/auth/users/search', { params: { email } }).then(res => res.data)

// Expense endpoints
export const fetchExpenses = (month) => api.get('/expenses', { params: { month } })
export const addExpense = (expense) => api.post('/expenses', expense)

// Budget endpoints
export const setBudget = (budgetData) => api.post('/budget', budgetData)
export const getBudget = (month) => api.get('/budget', { params: { month } })
export const getBudgetAlert = (month) => api.get('/budget/alert', { params: { month } })

// Report endpoints
export const getReportSummary = (month) => api.get('/report/summary', { params: { month } })

// Team endpoints
export const fetchTeams = () => api.get('/teams').then(res => res.data)
export const createTeam = (data) => api.post('/teams', data).then(res => res.data)
export const getTeam = (teamId) => api.get(`/teams/${teamId}`).then(res => res.data)
export const updateTeam = (teamId, data) => api.put(`/teams/${teamId}`, data).then(res => res.data)
export const deleteTeam = (teamId) => api.delete(`/teams/${teamId}`).then(res => res.data)

// Team member endpoints
export const addTeamMember = (teamId, userId, role) => 
  api.post(`/teams/${teamId}/members`, { userId, role }).then(res => res.data)
export const removeTeamMember = (teamId, userId) => 
  api.delete(`/teams/${teamId}/members/${userId}`).then(res => res.data)
export const updateTeamMemberRole = (teamId, userId, role) => 
  api.put(`/teams/${teamId}/members/${userId}/role`, { role }).then(res => res.data)

// Team expense endpoints
export const fetchTeamExpenses = (teamId, month) => 
  api.get(`/teams/${teamId}/expenses`, { params: { month } }).then(res => res.data)
export const createTeamExpense = (teamId, data) => 
  api.post(`/teams/${teamId}/expenses`, data).then(res => res.data)
export const updateTeamExpense = (teamId, expenseId, data) => 
  api.put(`/teams/${teamId}/expenses/${expenseId}`, data).then(res => res.data)
export const deleteTeamExpense = (teamId, expenseId) => 
  api.delete(`/teams/${teamId}/expenses/${expenseId}`).then(res => res.data)

// Team budget and summary endpoints
export const getTeamSummary = (teamId, month) => 
  api.get(`/teams/${teamId}/summary`, { params: { month } }).then(res => res.data)
export const setTeamBudget = (teamId, data) => 
  api.post(`/teams/${teamId}/budget`, data).then(res => res.data)
export const getTeamBudget = (teamId, month) => 
  api.get(`/teams/${teamId}/budget`, { params: { month } }).then(res => res.data)

export default api
