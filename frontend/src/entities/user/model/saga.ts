// import { call, put, takeLatest } from "redux-saga/effects";
import { call, put, takeLatest } from "typed-redux-saga";
import { authApi } from "./api";

import {
  registerRequest,
  registerSuccess,
  registerFailure,
  loginSuccess,
  loginFailure,
  loginRequest,
} from "./slice";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { LoginPayload, RegisterPayload, RegisterResponse } from "./types";

// ---- Register ----
function* registerSaga(action: PayloadAction<RegisterPayload>) {
  try {
    const response: RegisterResponse = yield* call(
      authApi.register,
      action.payload
    );

    localStorage.setItem("accessToken", response.access);
    localStorage.setItem("refreshToken", response.refresh);

    yield* put(registerSuccess(response));
  } catch (err: unknown) {
    let message = "Registration failed";

    if (err && typeof err === "object" && "response" in err) {
      const axiosErr = err as {
        response?: { data?: { detail?: string } };
        message?: string;
      };
      message = axiosErr.response?.data?.detail ?? axiosErr.message ?? message;
    } else if (err instanceof Error) {
      message = err.message;
    }

    yield* put(registerFailure(message));
  }
}

// ---- LOGIN ----
function* loginSaga(action: PayloadAction<LoginPayload>) {
  try {
    const response: RegisterResponse = yield* call(
      authApi.login,
      action.payload
    );

    localStorage.setItem("accessToken", response.access);
    localStorage.setItem("refreshToken", response.refresh);

    yield* put(loginSuccess(response));
  } catch (err: unknown) {
    let message = "Login failed";

    if (err && typeof err === "object" && "response" in err) {
      const axiosErr = err as {
        response?: { data?: { detail?: string } };
        message?: string;
      };
      message = axiosErr.response?.data?.detail ?? axiosErr.message ?? message;
    } else if (err instanceof Error) {
      message = err.message;
    }

    yield* put(loginFailure(message));
  }
}

export function* userSaga() {
  yield* takeLatest(registerRequest.type, registerSaga);
  yield* takeLatest(loginRequest.type, loginSaga);
}
