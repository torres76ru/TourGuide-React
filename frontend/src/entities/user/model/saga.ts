// import { call, put, takeLatest } from "redux-saga/effects";
import { call, put, takeLatest } from 'typed-redux-saga';
import { authApi } from './api';

import {
  registerRequest,
  registerSuccess,
  registerFailure,
  loginSuccess,
  loginFailure,
  loginRequest,
} from './slice';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { LoginPayload, RegisterPayload, RegisterResponse } from './types';
import type { AxiosError } from 'axios';

function extractErrorMessages(err: unknown): string {
  const error = err as AxiosError<{ [key: string]: string[] | string }>;
  if (error && typeof error === 'object' && 'response' in error) {
    const data = error.response?.data;
    if (data && typeof data === 'object') {
      if (typeof data.error === 'string') {
        return data.error;
      }
      const messages: string[] = [];
      for (const key in data) {
        const value = data[key];
        if (Array.isArray(value)) {
          messages.push(...value);
        } else if (typeof value === 'string') {
          messages.push(value);
        }
      }
      if (messages.length) return messages.join('\n');
    }
    return error.message ?? 'Unknown error';
  } else if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown error';
}

// ---- Register ----
function* registerSaga(action: PayloadAction<RegisterPayload>) {
  try {
    const response: RegisterResponse = yield* call(authApi.register, action.payload);

    localStorage.setItem('accessToken', response.access);
    localStorage.setItem('refreshToken', response.refresh);
    localStorage.setItem('user', JSON.stringify(response.user));

    yield* put(registerSuccess(response));
  } catch (err: unknown) {
    const message = extractErrorMessages(err);

    yield* put(registerFailure(message));
  }
}

// ---- LOGIN ----
function* loginSaga(action: PayloadAction<LoginPayload>) {
  try {
    const response: RegisterResponse = yield* call(authApi.login, action.payload);

    localStorage.setItem('accessToken', response.access);
    localStorage.setItem('refreshToken', response.refresh);
    localStorage.setItem('user', JSON.stringify(response.user));

    yield* put(loginSuccess(response));
  } catch (err: unknown) {
    const message = extractErrorMessages(err);

    yield* put(loginFailure(message));
  }
}

export function* userSaga() {
  yield* takeLatest(registerRequest.type, registerSaga);
  yield* takeLatest(loginRequest.type, loginSaga);
}
