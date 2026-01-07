import { call, put, takeLatest, select } from 'redux-saga/effects'
import * as api from '../../services/api'
import {
  fetchExpensesRequest,
  fetchExpensesSuccess,
  fetchExpensesFailure,
  addExpenseRequest,
  addExpenseSuccess,
  addExpenseFailure,
  setBudgetRequest,
  setBudgetSuccess,
  setBudgetFailure,
  fetchBudgetRequest,
  fetchBudgetSuccess,
  fetchBudgetFailure,
  fetchAlertRequest,
  fetchAlertSuccess,
  fetchAlertFailure,
  fetchSummaryRequest,
  fetchSummarySuccess,
  fetchSummaryFailure
} from './expenseSlice'

// Worker Sagas
function* fetchExpensesSaga(action) {
  try {
    const response = yield call(api.fetchExpenses, action.payload)
    yield put(fetchExpensesSuccess(response.data))
  } catch (error) {
    yield put(fetchExpensesFailure(error.response?.data?.error || error.message))
  }
}

function* addExpenseSaga(action) {
  try {
    const response = yield call(api.addExpense, action.payload)
    yield put(addExpenseSuccess(response.data))
    
    // Refresh summary and alert after adding expense
    const currentMonth = yield select((state) => state.expense.currentMonth)
    yield put(fetchSummaryRequest(currentMonth))
    yield put(fetchAlertRequest(currentMonth))
  } catch (error) {
    yield put(addExpenseFailure(error.response?.data?.error || error.message))
  }
}

function* setBudgetSaga(action) {
  try {
    const response = yield call(api.setBudget, action.payload)
    yield put(setBudgetSuccess(response.data))
  } catch (error) {
    yield put(setBudgetFailure(error.response?.data?.error || error.message))
  }
}

function* fetchBudgetSaga(action) {
  try {
    const response = yield call(api.getBudget, action.payload)
    yield put(fetchBudgetSuccess(response.data))
  } catch (error) {
    yield put(fetchBudgetFailure(error.response?.data?.error || error.message))
  }
}

function* fetchAlertSaga(action) {
  try {
    const response = yield call(api.getBudgetAlert, action.payload)
    yield put(fetchAlertSuccess(response.data))
  } catch (error) {
    yield put(fetchAlertFailure(error.response?.data?.error || error.message))
  }
}

function* fetchSummarySaga(action) {
  try {
    const response = yield call(api.getReportSummary, action.payload)
    yield put(fetchSummarySuccess(response.data))
  } catch (error) {
    yield put(fetchSummaryFailure(error.response?.data?.error || error.message))
  }
}

// Watcher Saga
export default function* expenseSaga() {
  yield takeLatest(fetchExpensesRequest.type, fetchExpensesSaga)
  yield takeLatest(addExpenseRequest.type, addExpenseSaga)
  yield takeLatest(setBudgetRequest.type, setBudgetSaga)
  yield takeLatest(fetchBudgetRequest.type, fetchBudgetSaga)
  yield takeLatest(fetchAlertRequest.type, fetchAlertSaga)
  yield takeLatest(fetchSummaryRequest.type, fetchSummarySaga)
}
