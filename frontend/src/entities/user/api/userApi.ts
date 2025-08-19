import axios from "axios";

export interface RegisterPayload {
  first_name?: string;
  last_name?: string;
  username: string;
  email: string;
  password: string;
  password2: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterResponse {
  user: {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_guide: boolean;
  };
  refresh: string;
  access: string;
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const authApi = {
  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const response = await axios.post<RegisterResponse>(
      `${BASE_URL}/auth/register/`,
      payload
    );
    return response.data;
  },
  login: async (payload: LoginPayload): Promise<RegisterResponse> => {
    const response = await axios.post<RegisterResponse>(
      `${BASE_URL}/auth/login/`,
      payload
    );
    return response.data;
  },
};
