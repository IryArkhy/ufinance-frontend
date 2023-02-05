import axios, { AxiosError } from 'axios';

import { getUserToken } from './localStorage';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getUserToken();

    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    console.error('axios', error);
    return Promise.reject(error);
  },
);

export const isAxiosError = (error: unknown): error is AxiosError => {
  return error instanceof AxiosError;
};

export default axiosInstance;
