import axios, { AxiosError, HttpStatusCode } from "axios";
import { API_URL } from './../index';
import { ILoginCheckRequest, ILoginRequest, IRejectOptions, ISignupResponse } from "@/types/api-services/UserServiceTypes";
import { IUser } from "@/types/User";
import { createAsyncThunk } from "@reduxjs/toolkit";

const api = axios.create({
    baseURL: API_URL + '/api/auth'
});

const Points = {
    signup: '/signup',
    authCheck: '/',
    login: '/login'
}

export const UserService = {
    signup: createAsyncThunk<ISignupResponse, string, IRejectOptions>(Points.signup, async (username, {rejectWithValue}) => {
        try {            
            const res = await api.post(Points.signup, { username });
            return res.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log(error.message);
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Unexpected signup error');
        }
    }),

    loginCheck: createAsyncThunk<boolean, string, IRejectOptions>(`${Points.login}Check`, async (username, {rejectWithValue}) => {
        try {            
            const res = await api.get(`${Points.login}/${username}`);
            return res.status === HttpStatusCode.Ok;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log(error.message);
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Unexpected loginCheck error');
        }
    }),

    authCheck: createAsyncThunk<IUser, void, IRejectOptions>(Points.authCheck, async (_, {rejectWithValue}) => {
        try {            
            const res = await api.get<IUser>(Points.authCheck);
            return res.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log(error.message);
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Unexpected authCheck error');
        }
    }),

    login: createAsyncThunk<IUser, ILoginRequest, IRejectOptions>(Points.login, async (body, {rejectWithValue}) => {
        try {            
            const res = await api.post<IUser>(Points.login, {...body});
            return res.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log(error.message);
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Unexpected login error');
        }
    }),
}