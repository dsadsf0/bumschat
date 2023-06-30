import { RootState } from "..";
import { IUser } from './../../types/User';
import { UserError, UserLoading, UserState } from './UserSlice';

export const getUserState = (state:RootState): UserState => state.user;
export const getUser = (state:RootState): IUser => state.user.user;
export const getUserError = (state:RootState): UserError => state.user.error;
export const getUserLoading = (state:RootState): UserLoading => state.user.isLoading;
