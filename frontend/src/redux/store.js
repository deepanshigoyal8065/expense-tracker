import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import authReducer from './auth/authSlice'
import expenseReducer from './expense/expenseSlice'
import toastReducer from './toast/toastSlice'
import teamReducer from './team/teamSlice'
import rootSaga from './rootsaga'

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
  reducer: {
    auth: authReducer,
    expense: expenseReducer,
    toast: toastReducer,
    team: teamReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false, serializableCheck: false }).concat(sagaMiddleware)
})

sagaMiddleware.run(rootSaga)

export default store
