import axiosInstance from '../axios';

import { TotalBalance } from './accounts';
import { Transaction } from './transactions';

export const getTotalBalance = async () => {
  return await axiosInstance.get<{ balance: TotalBalance }>('api/insights/balance');
};

export type GetOverviewResponse = {
  transactionsCount: number;
  totalExpensesAndEarnings: {
    expensesInUah: number;
    earningsInUah: number;
  };
};

export const getOverview = async () => {
  return await axiosInstance.get<GetOverviewResponse>('api/insights/currentMonth/overview');
};

export type GetCurrentMonthsStatisticsResponse = {
  balanceData: {
    date: number[];
    balance: number[];
  };
  transactionsByCategoryData: {
    'No category': number;
    [categoryName: string]: number;
  };
};

export const getStatistics = async () => {
  return await axiosInstance.get<GetCurrentMonthsStatisticsResponse>(
    'api/insights/currentMonth/statistics',
  );
};

export type GetCurrentMonthTransactionsResponse = {
  transactions: Transaction[];
};

export const getMonthLastTransactions = async () => {
  return await axiosInstance.get<GetCurrentMonthTransactionsResponse>(
    'api/insights/currentMonth/transactions',
  );
};
