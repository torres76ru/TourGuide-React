import axios from 'axios';
import type { LoginPayload, RegisterPayload, RegisterResponse, User } from './types';
import { API_BASE_URL, BASE_URL } from 'shared/config/constants';
import { store } from 'app/store/mainStore';

export const authApi = {
  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const response = await axios.post<RegisterResponse>(`${API_BASE_URL}/auth/register/`, payload);
    return response.data;
  },
  login: async (payload: LoginPayload): Promise<RegisterResponse> => {
    const response = await axios.post<RegisterResponse>(`${API_BASE_URL}/auth/login/`, payload);
    return response.data;
  },
  logout: async (): Promise<void> => {
    await axios.post(`${API_BASE_URL}/auth/logout/`);
  },
  refreshToken: (refreshToken: string) =>
    axios.post(`${API_BASE_URL}/token/refresh/`, { refresh: refreshToken }),
  updatePassword: (payload: {
    old_password: string;
    new_password1: string;
    new_password2: string;
  }) =>
    axios.post(`${BASE_URL}/dj-rest-auth/password/change/`, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${store.getState().user.accessToken}`,
      },
    }),
  updateProfile: async (payload: { first_name: string; last_name: string }): Promise<User> => {
    const response = await axios.patch(`${BASE_URL}/api/auth/me/`, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${store.getState().user.accessToken}`,
      },
    });
    return response.data;
  },
};
