import { all } from 'redux-saga/effects'
import expenseSaga from './expense/expenseSaga'
import teamSaga from './team/teamSaga'

export default function* rootSaga() {
  yield all([expenseSaga(), teamSaga()])
}
