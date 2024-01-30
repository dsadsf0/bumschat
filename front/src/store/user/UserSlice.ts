import { User } from '@/types/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserService } from '@/api/services/UserService';

export type UserError = {
    auth: string;
    loginCheck: string;
    login: string;
    signup: string;
    logout: string;
    recovery: string;
};

export type UserLoading = {
    auth: boolean;
    loginCheck: boolean;
    login: boolean;
    signup: boolean;
    logout: boolean;
    recovery: boolean;
};

export type UserState = {
    user: User | null;
    isLoading: UserLoading;
    error: UserError;
};

const initState: UserState = {
    user: null,
    isLoading: {
        auth: false,
        loginCheck: false,
        login: false,
        signup: false,
        logout: false,
        recovery: false,
    },
    error: {
        auth: '',
        loginCheck: '',
        login: '',
        signup: '',
        logout: '',
        recovery: '',
    },
};

export const UserSlice = createSlice({
    name: 'user',
    initialState: initState,
    reducers: {
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
        },
        setUserError(state, action: PayloadAction<{ key: keyof UserError; error: string }>) {
            state.error[action.payload.key] = action.payload.error;
        },
    },
    extraReducers(builder) {
        builder
            //Signup
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
                state.error.signup = String(Array.isArray(action.payload) ? action.payload.join('. ') : action.payload);
                state.user = null;
            })

            // auth checking | getting user
            .addCase(UserService.getUser.pending, (state) => {
                state.isLoading.auth = true;
                state.error.auth = '';
            })
            .addCase(UserService.getUser.fulfilled, (state, action) => {
                state.isLoading.auth = false;
                state.error.auth = '';
                state.user = action.payload;
            })
            .addCase(UserService.getUser.rejected, (state, action) => {
                state.isLoading.auth = false;
                state.error.auth = String(Array.isArray(action.payload) ? action.payload.join('. ') : action.payload);
                state.user = null;
            })

            // Username checking
            .addCase(UserService.usernameCheck.pending, (state) => {
                state.isLoading.loginCheck = true;
            })
            .addCase(UserService.usernameCheck.fulfilled, (state) => {
                state.isLoading.loginCheck = false;
                state.error.loginCheck = '';
            })
            .addCase(UserService.usernameCheck.rejected, (state, action) => {
                state.isLoading.loginCheck = false;
                state.error.loginCheck = String(
                    Array.isArray(action.payload) ? action.payload.join('. ') : action.payload
                );
                state.user = null;
            })

            // Login
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
                state.error.login = String(Array.isArray(action.payload) ? action.payload.join('. ') : action.payload);
                state.user = null;
            })

            // Logout
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
                state.error.logout = String(Array.isArray(action.payload) ? action.payload.join('. ') : action.payload);
            })

            // Recovery
            .addCase(UserService.recovery.pending, (state) => {
                state.isLoading.recovery = true;
            })
            .addCase(UserService.recovery.fulfilled, (state, action) => {
                state.isLoading.recovery = false;
                state.error.recovery = '';
                state.user = action.payload;
            })
            .addCase(UserService.recovery.rejected, (state, action) => {
                state.isLoading.recovery = false;
                state.error.recovery = String(
                    Array.isArray(action.payload) ? action.payload.join('. ') : action.payload
                );
                state.user = null;
            });
    },
});

export const { setUser, setUserError } = UserSlice.actions;

export default UserSlice.reducer;
