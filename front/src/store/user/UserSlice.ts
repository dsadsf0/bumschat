import { IUser } from "@/types/User";
import { createReducer, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserService } from '@/api/services/UserService';


export interface UserError {
    auth: string,
    loginCheck: string
    login: string,
    signup: string,
    logout: string,
}

export interface UserLoading {
    auth: boolean,
    loginCheck: boolean
    login: boolean,
    signup: boolean,
    logout: boolean, 
}

export interface UserState {
    user: IUser | null,
    isLoading: UserLoading,
    error: UserError,
}

const initState: UserState = {
    user: null,
    isLoading: {
        auth: false,
        loginCheck: false,
        login: false,
        signup: false,
        logout: false,
    },
    error: {
        auth: '',
        loginCheck: '',
        login: '',
        signup: '',
        logout: '',
    },
}

export const UserSlice = createSlice({
    name: 'user',
    initialState: initState,
    reducers: {
        setUser(state, action: PayloadAction<IUser>) {
            state.user = action.payload;
        },
        setUserError(state, action: PayloadAction<{key: keyof UserError, error: string}>) {
            state.error[action.payload.key] = action.payload.error;
        }
    },
    extraReducers(builder) {
        builder
            //signup
            .addCase(UserService.signup.pending, (state) => {
                state.isLoading.signup = true;
            })
            .addCase(UserService.signup.fulfilled, (state, action) => {
                state.isLoading.signup = false;
                state.error.signup = '';
                state.user = action.payload.user;
            })
            .addCase(UserService.signup.rejected, (state, action) => {
                state.isLoading.signup = false;
                state.error.signup = action.payload || 'Unexpected Error';
                state.user = null;
            })

            // auth checking
            .addCase(UserService.authCheck.pending, (state) => {
                state.isLoading.auth = true;
                state.error.auth = '';
            })
            .addCase(UserService.authCheck.fulfilled, (state, action) => {
                state.isLoading.auth = false;
                state.error.auth = '';
                state.user = action.payload;
            })
            .addCase(UserService.authCheck.rejected, (state, action) => {
                state.isLoading.auth = false;
                state.error.auth = action.payload || 'Unexpected Error';
                state.user = null;
            })

            // login checking
            .addCase(UserService.loginCheck.pending, (state) => {
                state.isLoading.loginCheck = true;
            })
            .addCase(UserService.loginCheck.fulfilled, (state) => {
                state.isLoading.loginCheck = false;
                state.error.loginCheck = '';
            })
            .addCase(UserService.loginCheck.rejected, (state, action) => {
                state.isLoading.loginCheck = false;
                state.error.loginCheck = action.payload || 'Unexpected Error';
                state.user = null;
            })

            // login
            .addCase(UserService.login.pending, (state) => {
                state.isLoading.login = true;
            })
            .addCase(UserService.login.fulfilled, (state, action) => {
                state.isLoading.login = false;
                state.error.login = '';
                state.user = action.payload;
            })
            .addCase(UserService.login.rejected, (state, action) => {
                state.isLoading.login = false;
                state.error.login = action.payload || 'Unexpected Error';
                state.user = null;
            })

            // logout
            .addCase(UserService.logout.pending, (state) => {
                state.isLoading.logout = true;
            })
            .addCase(UserService.logout.fulfilled, (state) => {
                state.isLoading.logout = false;
                state.error.logout = '';
                state.user = null;
            })
            .addCase(UserService.logout.rejected, (state, action) => {
                state.isLoading.logout = false;
                state.error.logout = action.payload || 'Unexpected Error';
            })
    },
});

export const { setUser, setUserError, } = UserSlice.actions;


export default UserSlice.reducer;