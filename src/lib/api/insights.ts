import axiosInstance from '../axios';

import { TotalBalance } from './accounts';

export const getTotalBalance = async () => {
  return await axiosInstance.get<{ balance: TotalBalance }>('/api/insights/balance');
};
