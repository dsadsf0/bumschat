import { IUser } from "@/types/User";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserService } from '@/api/services/UserService';


export interface UserError {
    user: string,
}

export interface UserLoading {
    user: boolean,
}

export interface UserState {
    user: IUser | null,
    isLoading: UserLoading,
    error: UserError,
}

const initState: UserState = {
    user: null,
    isLoading: {
        user: false,
    },
    error: {
        user: '',
    },
}

export const UserSlice = createSlice({
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
    extraReducers(builder) {
        builder
            .addCase(UserService.authCheck.pending, (state) => {
                state.isLoading.user = true;
                state.error.user = '';
                
            })
            .addCase(UserService.authCheck.fulfilled, (state, action) => {
                state.isLoading.user = false;
                state.error.user = '';
                state.user = action.payload;

            })
            .addCase(UserService.authCheck.rejected, (state, action) => {
                state.isLoading.user = false;
                state.error.user = action.payload || 'Unexpexted Error';
                state.user = null;
            })
    },
});

export const { setUser, setUserError, setUserLoading, } = UserSlice.actions;


export default UserSlice.reducer;