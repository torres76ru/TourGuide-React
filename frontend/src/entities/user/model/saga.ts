// import { call, put, takeLatest } from "redux-saga/effects";
import { call, put, takeLatest } from "typed-redux-saga";
import {
  authApi,
  type RegisterPayload,
  type RegisterResponse,
} from "../api/userApi";

import { registerRequest, registerSuccess, registerFailure } from "./slice";
import type { PayloadAction } from "@reduxjs/toolkit";

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
    // 👈 вместо any
    let message = "Registration failed";

    if (err && typeof err === "object" && "response" in err) {
      // axios error
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

export function* userSaga() {
  yield takeLatest(registerRequest.type, registerSaga);
}
