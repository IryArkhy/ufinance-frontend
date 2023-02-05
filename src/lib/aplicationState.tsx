import { useDispatch } from 'react-redux';

import { resetAccountsState } from '../redux/accounts/accountsSlice';
import { resetBalanceState } from '../redux/balance/balanceSlice';
import { resetCategoriesState } from '../redux/categories/categoriesSlice';
import { resetInsightsState } from '../redux/insights/insightsSlice';
import { resetPayeesState } from '../redux/payees/payeesSlice';
import { resetTagsState } from '../redux/tags/tagsSlice';
import { clearUser } from '../redux/user/userSlice';

import { clearToken } from './localStorage';

export const useClearState = () => {
  const dispatch = useDispatch();

  const handleClearState = () => {
    dispatch(clearUser());
    dispatch(resetAccountsState());
    dispatch(resetBalanceState());
    dispatch(resetCategoriesState());
    dispatch(resetInsightsState());
    dispatch(resetPayeesState());
    dispatch(resetTagsState());
    clearToken();
  };

  return { handleClearState };
};
