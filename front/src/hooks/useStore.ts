import { UserState } from '@/store/user/UserSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AnyAction, CombinedState, Dispatch } from 'redux';
import type { RootState, AppDispatch } from '../store';

export const useAppDispatch = (): ThunkDispatch<
	CombinedState<{
		user: UserState;
	}>,
	undefined,
	AnyAction
> &
	Dispatch<AnyAction> => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
