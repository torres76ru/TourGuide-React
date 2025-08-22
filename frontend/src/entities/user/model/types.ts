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

export interface User {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_guide: boolean;
}

export interface RegisterResponse {
  user: User;
  refresh: string;
  access: string;
}

export type UserType = 'tourist' | 'guide';
