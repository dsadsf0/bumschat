import axios, { AxiosError } from "axios";
import { API_URL } from './../index';
import { IRejectOptions, ISignupResponse } from "@/types/api-services/UserService";
import { IUser } from "@/types/User";
import { createAsyncThunk } from "@reduxjs/toolkit";

const api = axios.create({
    baseURL: API_URL + '/api/auth'
});

const Points = {
    signup: '/signup',
    authCheck: '/'
}

export const UserService = {
    signup: async (username: string): Promise<ISignupResponse | string> => {
        try {
            const res = await api.post<ISignupResponse>(Points.signup, {
                username
            });
            return res.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log(error.message);
                return error.message;
            }
            return 'Unexpected signup error';
        }
    },

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
}