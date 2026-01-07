import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  toasts: []
}

let nextId = 1

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: (state, action) => {
      state.toasts.push({
        id: nextId++,
        message: action.payload.message,
        type: action.payload.type || 'info', // success, error, warning, info
        duration: action.payload.duration || 3000
      })
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload)
    }
  }
})

export const { addToast, removeToast } = toastSlice.actions
export default toastSlice.reducer
