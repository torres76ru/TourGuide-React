import axios from 'axios';
import type { LoginPayload, RegisterPayload, RegisterResponse } from './types';
import { API_BASE_URL } from 'shared/config/constants';

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
};
