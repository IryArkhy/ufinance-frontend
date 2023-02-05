import axios from 'axios';

import { setToken } from '../localStorage';

export type User = {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  role: 'ADMIN' | 'BASE';
};

export type LoginReqBody = {
  email: string;
  password: string;
};

export type SignUpReqBody = {
  email: string;
  username: string;
  password: string;
};

export type UpdatePasswordReqBody = {
  oldPassword: string;
  newPassword: string;
};

export type UpdatePasswordResponse = {
  token: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

export const fetchUser = async (token: string) => {
  const userResponse = await axiosInstance.get<Pick<AuthResponse, 'user'>>('api/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return userResponse;
};

export const logIn = async (data: LoginReqBody) => {
  const response = await axiosInstance.post<AuthResponse>('/signin', {
    email: data.email,
    password: data.password,
  });

  if (response) {
    setToken(response.data.token);
  }

  return response.data;
};

export const signUp = async (data: SignUpReqBody) => {
  const response = await axiosInstance.post<AuthResponse>('/user', data);

  if (response) {
    setToken(response.data.token);
  }

  return response.data;
};

export const updatePassword = async (data: UpdatePasswordReqBody) => {
  const res = await axiosInstance.patch<UpdatePasswordResponse>('api/user/password', {
    oldPassword: data.oldPassword,
    newPassword: data.newPassword,
  });

  return res.data;
};
