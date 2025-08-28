import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { LoginPayload, RegisterPayload, RegisterResponse } from './types';

interface UserState {
  user: RegisterResponse['user'] | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  expiresAt: localStorage.getItem('expiresAt')
    ? parseInt(localStorage.getItem('expiresAt')!)
    : null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // ---- Register ----
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    registerRequest(state, _action: PayloadAction<RegisterPayload>) {
      state.loading = true;
      state.error = null;
    },
    registerSuccess(state, action: PayloadAction<RegisterResponse>) {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
    },
    registerFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    // ---- LOGIN ----
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loginRequest(state, _action: PayloadAction<LoginPayload>) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<RegisterResponse>) {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    logoutRequest(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;

      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('expiresAt');
    },
    setTokens(
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        expiresAt: number;
      }>
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.expiresAt = action.payload.expiresAt;

      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      localStorage.setItem('expiresAt', action.payload.expiresAt.toString());
    },
  },
});

export const {
  registerRequest,
  registerSuccess,
  registerFailure,
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  setTokens,
} = userSlice.actions;
export default userSlice.reducer;
