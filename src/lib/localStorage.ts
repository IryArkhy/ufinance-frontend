const TOKEN_KEY = 'ufinance:user:token';

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getUserToken = () => {
  const rawToken = localStorage.getItem(TOKEN_KEY);
  if (rawToken) {
    return rawToken;
  }
  return null;
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
