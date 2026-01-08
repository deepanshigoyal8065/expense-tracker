import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import expenseReducer from './expense/expenseSlice'
import teamReducer from './team/teamSlice'
import rootSaga from './rootsaga'

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
  reducer: {
    expense: expenseReducer,
    team: teamReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false, serializableCheck: false }).concat(sagaMiddleware)
})

sagaMiddleware.run(rootSaga)

export default store
