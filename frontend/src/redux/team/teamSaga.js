import { call, put, takeLatest } from 'redux-saga/effects'
import * as api from '../../services/api'
import {
  fetchTeamsRequest,
  fetchTeamsSuccess,
  fetchTeamsFailure,
  createTeamRequest,
  createTeamSuccess,
  createTeamFailure,
  getTeamRequest,
  getTeamSuccess,
  getTeamFailure,
  updateTeamRequest,
  updateTeamSuccess,
  updateTeamFailure,
  addMemberRequest,
  addMemberSuccess,
  addMemberFailure,
  removeMemberRequest,
  removeMemberSuccess,
  removeMemberFailure,
  fetchTeamExpensesRequest,
  fetchTeamExpensesSuccess,
  fetchTeamExpensesFailure,
  addTeamExpenseRequest,
  addTeamExpenseSuccess,
  addTeamExpenseFailure,
  updateTeamExpenseRequest,
  updateTeamExpenseSuccess,
  updateTeamExpenseFailure,
  deleteTeamExpenseRequest,
  deleteTeamExpenseSuccess,
  deleteTeamExpenseFailure,
  getTeamSummaryRequest,
  getTeamSummarySuccess,
  getTeamSummaryFailure,
  setTeamBudgetRequest,
  setTeamBudgetSuccess,
  setTeamBudgetFailure
} from './teamSlice'

// Fetch teams
function* fetchTeamsSaga() {
  try {
    const teams = yield call(api.fetchTeams)
    yield put(fetchTeamsSuccess(teams))
  } catch (error) {
    yield put(fetchTeamsFailure(error.message))
  }
}

// Create team
function* createTeamSaga(action) {
  try {
    const team = yield call(api.createTeam, action.payload)
    yield put(createTeamSuccess(team))
  } catch (error) {
    yield put(createTeamFailure(error.message))
  }
}

// Get team
function* getTeamSaga(action) {
  try {
    const team = yield call(api.getTeam, action.payload)
    yield put(getTeamSuccess(team))
  } catch (error) {
    yield put(getTeamFailure(error.message))
  }
}

// Update team
function* updateTeamSaga(action) {
  try {
    const { teamId, data } = action.payload
    const team = yield call(api.updateTeam, teamId, data)
    yield put(updateTeamSuccess(team))
  } catch (error) {
    yield put(updateTeamFailure(error.message))
  }
}

// Add member
function* addMemberSaga(action) {
  try {
    const { teamId, userId, role } = action.payload
    const team = yield call(api.addTeamMember, teamId, userId, role)
    yield put(addMemberSuccess(team))
  } catch (error) {
    yield put(addMemberFailure(error.message))
  }
}

// Remove member
function* removeMemberSaga(action) {
  try {
    const { teamId, userId } = action.payload
    const team = yield call(api.removeTeamMember, teamId, userId)
    yield put(removeMemberSuccess(team))
  } catch (error) {
    yield put(removeMemberFailure(error.message))
  }
}

// Fetch team expenses
function* fetchTeamExpensesSaga(action) {
  try {
    const { teamId, month } = action.payload
    const expenses = yield call(api.fetchTeamExpenses, teamId, month)
    yield put(fetchTeamExpensesSuccess(expenses))
  } catch (error) {
    yield put(fetchTeamExpensesFailure(error.message))
  }
}

// Add team expense
function* addTeamExpenseSaga(action) {
  try {
    const { teamId, data } = action.payload
    const result = yield call(api.createTeamExpense, teamId, data)
    yield put(addTeamExpenseSuccess(result))
    
    // Refresh summary
    yield put(getTeamSummaryRequest({ teamId }))
  } catch (error) {
    yield put(addTeamExpenseFailure(error.message))
  }
}

// Update team expense
function* updateTeamExpenseSaga(action) {
  try {
    const { teamId, expenseId, data } = action.payload
    const expense = yield call(api.updateTeamExpense, teamId, expenseId, data)
    yield put(updateTeamExpenseSuccess(expense))
    
    // Refresh summary
    yield put(getTeamSummaryRequest({ teamId }))
  } catch (error) {
    yield put(updateTeamExpenseFailure(error.message))
  }
}

// Delete team expense
function* deleteTeamExpenseSaga(action) {
  try {
    const { teamId, expenseId } = action.payload
    yield call(api.deleteTeamExpense, teamId, expenseId)
    yield put(deleteTeamExpenseSuccess(expenseId))
    
    // Refresh summary
    yield put(getTeamSummaryRequest({ teamId }))
  } catch (error) {
    yield put(deleteTeamExpenseFailure(error.message))
  }
}

// Get team summary
function* getTeamSummarySaga(action) {
  try {
    const { teamId, month } = action.payload
    const summary = yield call(api.getTeamSummary, teamId, month)
    yield put(getTeamSummarySuccess(summary))
  } catch (error) {
    yield put(getTeamSummaryFailure(error.message))
  }
}

// Set team budget
function* setTeamBudgetSaga(action) {
  try {
    const { teamId, data } = action.payload
    const budget = yield call(api.setTeamBudget, teamId, data)
    yield put(setTeamBudgetSuccess(budget))
    
    // Refresh summary to update budget display
    yield put(getTeamSummaryRequest({ teamId, month: data.month }))
  } catch (error) {
    yield put(setTeamBudgetFailure(error.message))
  }
}

export default function* teamSaga() {
  yield takeLatest(fetchTeamsRequest.type, fetchTeamsSaga)
  yield takeLatest(createTeamRequest.type, createTeamSaga)
  yield takeLatest(getTeamRequest.type, getTeamSaga)
  yield takeLatest(updateTeamRequest.type, updateTeamSaga)
  yield takeLatest(addMemberRequest.type, addMemberSaga)
  yield takeLatest(removeMemberRequest.type, removeMemberSaga)
  yield takeLatest(fetchTeamExpensesRequest.type, fetchTeamExpensesSaga)
  yield takeLatest(addTeamExpenseRequest.type, addTeamExpenseSaga)
  yield takeLatest(updateTeamExpenseRequest.type, updateTeamExpenseSaga)
  yield takeLatest(deleteTeamExpenseRequest.type, deleteTeamExpenseSaga)
  yield takeLatest(getTeamSummaryRequest.type, getTeamSummarySaga)
  yield takeLatest(setTeamBudgetRequest.type, setTeamBudgetSaga)
}
