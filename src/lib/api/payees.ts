import axiosInstance from '../axios';

export type Payee = {
  id: string;
  name: string;
  userId: string;
};

export const fetchPayees = async () => {
  return await axiosInstance.get<{ payees: Payee[] }>('api/payees');
};

export const createPayees = async (names: string[]) => {
  return await axiosInstance.post<{ payees: Payee[] }>('api/payees', { payees: names });
};

export const deletePayee = async (id: string) => {
  return await axiosInstance.delete<{ deletedPayee: Payee }>(`api/payees/${id}`);
};
