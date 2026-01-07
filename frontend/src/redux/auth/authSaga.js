import { call, put, takeLatest } from 'redux-saga/effects'
import * as api from '../../services/api'
import {
  signupRequest,
  signupSuccess,
  signupFailure,
  loginRequest,
  loginSuccess,
  loginFailure,
  loadUserRequest,
  loadUserSuccess,
  loadUserFailure
} from './authSlice'

// Worker Sagas
function* signupSaga(action) {
  try {
    const response = yield call(api.signup, action.payload)
    yield put(signupSuccess(response.data))
  } catch (error) {
    yield put(signupFailure(error.response?.data?.error || error.message))
  }
}

function* loginSaga(action) {
  try {
    const response = yield call(api.login, action.payload)
    yield put(loginSuccess(response.data))
  } catch (error) {
    yield put(loginFailure(error.response?.data?.error || error.message))
  }
}

function* loadUserSaga() {
  try {
    const response = yield call(api.loadUser)
    yield put(loadUserSuccess(response.data))
  } catch (error) {
    yield put(loadUserFailure())
  }
}

// Watcher Saga
export default function* authSaga() {
  yield takeLatest(signupRequest.type, signupSaga)
  yield takeLatest(loginRequest.type, loginSaga)
  yield takeLatest(loadUserRequest.type, loadUserSaga)
}
