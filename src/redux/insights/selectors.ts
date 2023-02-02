import { RootState } from '../store';

export const getOverview = (store: RootState) => store.insights.overview;
export const getStatistics = (store: RootState) => store.insights.statistics;
export const getRecentTransactions = (store: RootState) => store.insights.currentMonthTransactions;
