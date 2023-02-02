import axiosInstance from '../axios';

import { getAuthHeader } from './utils';

export type AvailableCurrency = 'UAH' | 'USD' | 'EUR' | 'BTC' | 'ETH';
export type AvailableIcons =
  | 'BANK'
  | 'CARD'
  | 'MONEY'
  | 'BILL'
  | 'SAVINGS'
  | 'WALLET'
  | 'USD'
  | 'EUR'
  | 'BTC'
  | 'PAYMENTS'
  | 'SHOPPING'
  | 'TRAVEL';

export type Account = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  balance: number;
  currency: AvailableCurrency;
  isCredit: boolean;
  icon: AvailableIcons;
  userId: string;
};

export const getAccounts = async () => {
  return await axiosInstance.get<{ accounts: Account[] }>('api/accounts');
};

export type CreateAccountReqBody = {
  name: string;
  currency: AvailableCurrency;
  balance: number;
  isCredit: boolean;
  icon: AvailableIcons;
};

export type TotalBalance = {
  id: string;
  createdAt: string;
  updatedAt: string;
  month: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  year: number;
  currency: 'USD';
  balance: number;
  userId: string;
};

export type CreateAccountResponse = {
  totalBalance: TotalBalance;
  account: Account;
};

export const createAccount = async (data: CreateAccountReqBody) => {
  return await axiosInstance.post<CreateAccountResponse>('api/accounts', data);
};

export type UpdateAccountReqBody = {
  name: string;
  isCredit?: boolean;
  icon: AvailableIcons;
};

export const updateAccount = async (accountId: string, data: UpdateAccountReqBody) => {
  return await axiosInstance.patch<{ account: Account }>(`api/accounts/${accountId}`, data);
};

export const deleteAccount = async (accountId: string) => {
  return await axiosInstance.delete<{ deletedAccount: Account; userBalance: TotalBalance }>(
    `api/accounts/${accountId}`,
  );
};
