import { all } from 'redux-saga/effects'
import authSaga from './auth/authSaga'
import expenseSaga from './expense/expenseSaga'

export default function* rootSaga() {
  yield all([authSaga(), expenseSaga()])
}
