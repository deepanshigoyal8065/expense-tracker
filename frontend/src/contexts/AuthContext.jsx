import { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { login as apiLogin, signup as apiSignup, loadUser as apiLoadUser } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Clear any existing token on mount to ensure fresh login
  useEffect(() => {
    localStorage.removeItem('token')
    setUser(null)
    setLoading(false)
  }, [])

  const loadUser = async () => {
    try {
      setLoading(true)
      setError(null)
      const userData = await apiLoadUser()
      setUser(userData)
    } catch (err) {
      console.error('Failed to load user:', err)
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiLogin(credentials)
      // API returns { user, token }
      const { user: userData, token } = response
      localStorage.setItem('token', token)
      setUser(userData)
      return userData
    } catch (err) {
      console.error('Login error:', err)
      const errorMessage = err.response?.data?.error || err.message || 'Login failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const signup = async (data) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiSignup(data)
      // API returns { user, token }
      const { user: userData, token } = response
      localStorage.setItem('token', token)
      setUser(userData)
      return userData
    } catch (err) {
      console.error('Signup error:', err)
      const errorMessage = err.response?.data?.error || err.message || 'Signup failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setError(null)
  }

  const updateUser = (userData) => {
    setUser(userData)
  }

  const clearError = () => {
    setError(null)
  }

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    loadUser,
    updateUser,
    clearError
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
