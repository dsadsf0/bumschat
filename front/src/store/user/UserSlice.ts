import { IUser } from "@/types/User";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface UserError {
    user: string
}

export interface UserLoading {
    user: boolean
}

export interface UserState {
    user: IUser,
    isLoading: UserLoading,
    error: UserError,
}

const initState: UserState = {
    user: {
        username: '',
    },
    isLoading: {
        user: false,
    },
    error: {
        user: '',
    },
}

export const PaymentStatus = createSlice({
    name: 'user',
    initialState: initState,
    reducers: {
        setUser(state, action: PayloadAction<IUser>) {
            state.user = action.payload;
        },
        setUserError(state, action: PayloadAction<string>) {
            state.error.user = action.payload;
        },
        setUserLoading(state, action: PayloadAction<boolean>) {
            state.isLoading.user = action.payload;
        },
    },
})

export default PaymentStatus.reducer;