import { configureStore, ThunkAction } from "@reduxjs/toolkit";
import { Action, combineReducers } from "redux";
import UserSlice from "./user/UserSlice";


const rootReducer = combineReducers({
	user: UserSlice,
})
	
export const store = configureStore({
	reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;