// import { call, put, takeLatest } from "redux-saga/effects";
import { call, delay, put, select, takeLatest, fork } from 'typed-redux-saga';
import { authApi } from './api';

import {
  registerRequest,
  registerSuccess,
  registerFailure,
  loginSuccess,
  loginFailure,
  loginRequest,
  setTokens,
  logoutRequest,
} from './slice';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { LoginPayload, RegisterPayload, RegisterResponse } from './types';
import type { AxiosError } from 'axios';
import type { RootState } from 'app/store/mainStore';

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

    const tenMinutesLater = Date.now() + 10 * 60 * 1000;

    yield* put(registerSuccess(response));
    yield* put(
      setTokens({
        accessToken: response.access,
        refreshToken: response.refresh,
        expiresAt: tenMinutesLater,
      })
    );
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

    const tenMinutesLater = Date.now() + 10 * 60 * 1000;

    yield* put(loginSuccess(response));
    yield* put(
      setTokens({
        accessToken: response.access,
        refreshToken: response.refresh,
        expiresAt: tenMinutesLater,
      })
    );
  } catch (err: unknown) {
    const message = extractErrorMessages(err);

    yield* put(loginFailure(message));
  }
}
function* watchTokenExpiration() {
  console.info('watchTokenExpiration started');
  while (true) {
    console.info('watchTokenExpiration cycle');

    const expiresAt = yield* select((state: RootState) => state.user.expiresAt);
    const refreshToken = yield* select((state: RootState) => state.user.refreshToken);
    if (!expiresAt || !refreshToken) {
      yield* delay(10000);
      continue;
    }
    const now = Date.now();

    const msToExpire = expiresAt - now - 30000; // обновлять за 30 сек до истечения
    console.log(msToExpire);
    if (msToExpire > 0) {
      yield* delay(msToExpire);
    }
    try {
      const response = yield* call(authApi.refreshToken, refreshToken);
      const tenMinutesLater = Date.now() + 10 * 60 * 1000;
      yield* put(
        setTokens({
          accessToken: response.data.access,
          refreshToken: response.data.refresh,
          expiresAt: tenMinutesLater,
        })
      );
    } catch (e: unknown) {
      console.error('Error refreshing token:', e);
      yield* put(logoutRequest());
      // обработка ошибки, например, logout
    }
  }
}

export function* userSaga() {
  yield* takeLatest(registerRequest.type, registerSaga);
  yield* takeLatest(loginRequest.type, loginSaga);
  yield* fork(watchTokenExpiration);
}
