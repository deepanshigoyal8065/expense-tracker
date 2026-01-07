import { all } from 'redux-saga/effects'
import authSaga from './auth/authSaga'
import expenseSaga from './expense/expenseSaga'
import teamSaga from './team/teamSaga'

export default function* rootSaga() {
  yield all([authSaga(), expenseSaga(), teamSaga()])
}
