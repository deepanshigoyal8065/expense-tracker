import { createContext, useContext, useState, useCallback } from 'react'
import PropTypes from 'prop-types'

const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback(({ message, type = 'info', duration = 3000 }) => {
    const id = Date.now() + Math.random()
    const toast = { id, message, type, duration }
    
    setToasts((prev) => [...prev, toast])

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }, [removeToast])

  const clearAll = useCallback(() => {
    setToasts([])
  }, [])

  const value = {
    toasts,
    addToast,
    removeToast,
    clearAll
  }

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired
}

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
