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
export const signup = (data) => axios.post(`${API_URL}/auth/signup`, data)
export const login = (data) => axios.post(`${API_URL}/auth/login`, data)
export const loadUser = () => api.get('/auth/me')

// Expense endpoints
export const fetchExpenses = (month) => api.get('/expenses', { params: { month } })
export const addExpense = (expense) => api.post('/expenses', expense)

// Budget endpoints
export const setBudget = (budgetData) => api.post('/budget', budgetData)
export const getBudget = (month) => api.get('/budget', { params: { month } })
export const getBudgetAlert = (month) => api.get('/budget/alert', { params: { month } })

// Report endpoints
export const getReportSummary = (month) => api.get('/report/summary', { params: { month } })

export default api
