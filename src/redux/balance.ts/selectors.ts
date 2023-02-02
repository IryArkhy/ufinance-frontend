import { RootState } from '../store';

export const getTotalBalance = (store: RootState) => store.balance.data;
