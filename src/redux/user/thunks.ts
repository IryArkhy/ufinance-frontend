import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  AuthResponse,
  LoginReqBody,
  UpdatePasswordReqBody,
  UpdatePasswordResponse,
  logIn,
  signUp as signUpRequest,
} from '../../lib/api/users';
import { ErrorData, handleError } from '../../lib/api/utils';
import axiosInstance from '../../lib/axios';

import { User } from './types';

export const login = createAsyncThunk<AuthResponse, LoginReqBody, { rejectValue: ErrorData }>(
  'user/login',
  async (data, thunkApi) => {
    try {
      const { token, user } = await logIn(data);

      return { token, user };
    } catch (error) {
      const errorPayload = handleError(error);
      return thunkApi.rejectWithValue(errorPayload);
    }
  },
);

export const signUp = createAsyncThunk<
  { token: string; user: User },
  { email: string; username: string; password: string },
  { rejectValue: ErrorData }
>('user/signUp', async (data, thunkApi) => {
  try {
    const response = await signUpRequest(data);

    return response;
  } catch (error) {
    const errorPayload = handleError(error);
    return thunkApi.rejectWithValue(errorPayload);
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchUser = createAsyncThunk<User, any, { rejectValue: ErrorData }>(
  'user/fetch',
  async (_, thunkApi) => {
    try {
      const res = await axiosInstance.get<{ user: User }>('api/user');
      return res.data.user;
    } catch (error) {
      const errorPayload = handleError(error);
      return thunkApi.rejectWithValue(errorPayload);
    }
  },
);

export const changePassword = createAsyncThunk<
  UpdatePasswordResponse,
  UpdatePasswordReqBody,
  { rejectValue: ErrorData }
>('user/changePassword', async (data, thunkApi) => {
  try {
    const res = await axiosInstance.patch<UpdatePasswordResponse>('api/user/password', {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });

    return res.data;
  } catch (error) {
    const errorPayload = handleError(error);
    return thunkApi.rejectWithValue(errorPayload);
  }
});
