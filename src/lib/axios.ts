import axios, { AxiosError } from 'axios';

import { getToken } from './localStorage';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

export const isAxiosError = (error: unknown): error is AxiosError => {
  return error instanceof AxiosError;
};

export default axiosInstance;
