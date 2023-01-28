import { RootState } from '../store';

import { User } from './types';

export const getUser = (store: RootState) => store.user.data as User;
export const getToken = (store: RootState) => store.user.token;
