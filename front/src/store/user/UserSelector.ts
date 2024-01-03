import { RootState } from '..';
import { User } from '../../types/user';
import { UserError, UserLoading, UserState } from './UserSlice';

export const getUserState = (state: RootState): UserState => state.user;
export const getUser = (state: RootState): User | null => state.user.user;
export const getUserStateError = (state: RootState): UserError => state.user.error;
export const getUserStateLoading = (state: RootState): UserLoading => state.user.isLoading;
