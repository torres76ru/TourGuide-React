import { call, put, takeLatest } from "redux-saga/effects";
import {
  authApi,
  type RegisterPayload,
  type RegisterResponse,
} from "../api/userApi";

import { registerRequest, registerSuccess, registerFailure } from "./slice";
import type { PayloadAction } from "@reduxjs/toolkit";

function* registerSaga(
  action: PayloadAction<RegisterPayload>
): Generator<any, void, any> {
  try {
    const response: RegisterResponse = yield call(
      authApi.register,
      action.payload
    );
    // Сохраняем токены в localStorage
    localStorage.setItem("accessToken", response.access);
    localStorage.setItem("refreshToken", response.refresh);
    yield put(registerSuccess(response));
  } catch (err: any) {
    const message =
      err.response?.data?.detail || err.message || "Registration failed";
    yield put(registerFailure(message));
  }
}

export function* userSaga() {
  yield takeLatest(registerRequest.type, registerSaga);
}
